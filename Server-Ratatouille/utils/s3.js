import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command,DeleteObjectCommand} from '@aws-sdk/client-s3';

import axios from "axios";
const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId:"AKIA3TD2SPMIJVRZKRHN",
    secretAccessKey: "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"
  },
});

async function getObject(key) {
  const command = new GetObjectCommand({
    Bucket: "tatcalatai",
    Key: key,
  });
  return await getSignedUrl(s3Client, command);
}



async function generateUploadUrl(filename, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: "tatcalatai",
      Key: `upload/${filename}`,
      ContentType: contentType,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Signed URL valid for 1 hour
  } catch (error) {
    console.error("Error generating signed URL for PUT:", error);
    throw error;
  }
}

async function putObject(uploadUrl, fileBinary) {
  try {
    const response = await axios.put(uploadUrl, fileBinary, {
      headers: {
        "Content-Type": "application/octet-stream", // Hoặc loại file phù hợp
      },
    });
    return response.status === 200
      ? { message: "File uploaded successfully" }
      : { message: "File upload failed", status: response.status };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: "tatcalatai",
        key:"/"
    });
    return await s3Client.send(command);
}   

async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: "tatcalatai",
        Key: key,
    });
    return await s3Client.send(command);
}

export default { getObject, putObject, listObjects, deleteObject, generateUploadUrl };