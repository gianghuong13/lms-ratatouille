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
  const command = new GetObjectCommand({
    Bucket: "tatcalatai",
    Key: key,
  });
  return await getSignedUrl(s3Client, command);
}



// Hàm tạo URL đã ký và trả về URL kèm Key
async function generateUploadUrl(filename, contentType, folder) {
  try {
    // Xác định folder (mặc định là "upload" nếu không chỉ định)
    const targetFolder = folder || "upload";
    const key = `${targetFolder}/${filename}`; // Key file trong bucket

    const command = new PutObjectCommand({
      Bucket: "tatcalatai",
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

async function listObjects(prefix) {
  const command = new ListObjectsV2Command({
    Bucket: "tatcalatai",
    Prefix: prefix, // Liệt kê các file bắt đầu bằng prefix
  });
  const response = await s3Client.send(command);
  return response;
}


async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: "tatcalatai",
        Key: key,
    });
    return await s3Client.send(command);
}

export default { getObject, putObject, listObjects, deleteObject, generateUploadUrl };