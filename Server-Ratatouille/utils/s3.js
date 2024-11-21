import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command,DeleteObjectCommand,CopyObjectCommand} from '@aws-sdk/client-s3';
import dotenv from "dotenv";
dotenv.config();
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
})

async function generateUploadUrl(fileName, fileType, folder) {
  const key = `${folder}/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { signedUrl, key };
}

async function putObject(signedUrl, data) {
  await fetch(signedUrl, {
    method: 'PUT',
    body: data,
  });
}
async function getObject(key) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

async function deleteObject(key) {
  try {
      // Kiểm tra đầu vào
      if (!key) {
          throw new Error("Key is required");
      }

      // Tạo lệnh xóa đối tượng S3
      const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
      });

      // Gửi yêu cầu xóa đến S3
      await s3Client.send(command);
  } catch (error) {
      // Ghi log lỗi và truyền lỗi lên
      console.error(`Error deleting object with key "${key}":`, error);
      throw error; // Để hàm gọi biết rằng đã có lỗi xảy ra
  }
}


async function listObjects(folder) {
  try {
    // Đảm bảo folder kết thúc bằng "/"
    if (!folder.endsWith("/")) {
      folder += "/";
    }

    const command = new ListObjectsV2Command({
      Bucket: bucketName, // Tên bucket
      Prefix: folder,     // Folder hoặc tiền tố
    });

    const response = await s3Client.send(command);

    // Trả về danh sách các file nếu có
    return response.Contents ? response.Contents.map(item => item.Key) : [];
  } catch (error) {
    console.error("Error listing objects:", error);
    throw new Error("Unable to list objects from S3");
  }
}

async function copyObject(key, newKey) {
  if (typeof key !== 'string' || typeof newKey !== 'string') {
    throw new TypeError('Both key and newKey must be strings');
  }

  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${key}`,
    Key: newKey,
  });

  try {
    // Sao chép object
    const copyResponse = await s3Client.send(copyCommand);
    console.log(`Object copied from ${key} to ${newKey}:`, copyResponse);

    // Xóa object cũ
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const deleteResponse = await s3Client.send(deleteCommand);
    console.log(`Object deleted from ${key}:`, deleteResponse);

    return {
      copyResponse,
      deleteResponse,
    };
  } catch (error) {
    console.error(`Error processing copy and delete from ${key} to ${newKey}:`, error);
    throw error;
  }
}


export default {generateUploadUrl, putObject, getObject, deleteObject, listObjects,copyObject};