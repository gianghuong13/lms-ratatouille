import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command,DeleteObjectCommand} from '@aws-sdk/client-s3';
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getObject(key) {
  try {
    // Tạo URL nếu key hợp lệ
    const command = new GetObjectCommand({
      Bucket: "lmsbucket-tva",
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL hết hạn trong 1 giờ
    });

    return signedUrl;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw new Error(`File not found: ${key}`);
    }
    console.error("Error generating signed URL:", error);
    throw new Error("Internal Server Error");
  }
}

// Hàm tạo URL đã ký và trả về URL kèm Key
async function generateUploadUrl(filename, contentType, folder) {
  try {
    // Xác định folder (mặc định là "upload" nếu không chỉ định)
    const targetFolder = folder || "upload";
    const key = `${targetFolder}/${filename}`; // Key file trong bucket

    const command = new PutObjectCommand({
      Bucket: "lmsbucket-tva",
      Key: key,
      ContentType: contentType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); 
    return { signedUrl, key }; // Trả về URL đã ký và key
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

// Hàm tải file sử dụng URL đã ký
async function putObject(signedUrl, fileBinary) {
  try {
    const response = await axios.put(signedUrl, fileBinary);
    return response.status === 200
      ? { message: "File uploaded successfully" }
      : { message: "File upload failed", status: response.status };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// async function listObjects(prefix) {
//   try {
//     const command = new ListObjectsV2Command({
//       Bucket: "lmsbucket-tva",
//       Prefix: prefix, // Liệt kê các file bắt đầu bằng prefix
//     });

//     const response = await s3Client.send(command);
//     if (!response.Contents || response.Contents.length === 0) {
//       return { message: "No objects found", objects: [] };
//     }

//     // Trả về danh sách đối tượng dưới dạng cấu trúc cụ thể
//     const objects = response.Contents.map(item => ({
//       key: item.Key,
//       lastModified: item.LastModified,
//       size: item.Size,
//     }));
//     return { message: "Objects listed successfully", objects };
//   } catch (error) {
//     console.error("Error listing objects:", error);
//     throw new Error("Failed to list objects");
//   }
// }

// async function deleteObject(key) {
//   try {
//     const command = new DeleteObjectCommand({
//       Bucket: "lmsbucket-tva",
//       Key: key,
//     });

//     await s3Client.send(command);
//     return { message: `Object with key "${key}" deleted successfully` };
//   } catch (error) {
//     if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
//       return { message: `Object not found: ${key}` };
//     }
//     console.error("Error deleting object:", error);
//     throw new Error("Failed to delete object");
//   }
// }


export default { getObject, putObject, generateUploadUrl };