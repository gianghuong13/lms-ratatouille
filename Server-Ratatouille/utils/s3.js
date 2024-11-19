import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command,DeleteObjectCommand} from '@aws-sdk/client-s3';
import dotenv from "dotenv";
import e from 'express';
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
      console.log(`Successfully deleted: ${key}`);
  } catch (error) {
      // Ghi log lỗi và truyền lỗi lên
      console.error(`Error deleting object with key "${key}":`, error);
      throw error; // Để hàm gọi biết rằng đã có lỗi xảy ra
  }
}


async function listObjects(folder) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folder,
  });
  const response = await s3Client.send(command);
  return response.Contents;
}

export default {generateUploadUrl, putObject, getObject, deleteObject, listObjects};