import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command,DeleteObjectCommand} from '@aws-sdk/client-s3';


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

async function putObject(filename,contentType) {
    const command = new PutObjectCommand({
        Bucket: "tatcalatai",
        Key: 'upload/'+filename,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
    
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

export { getObject, putObject, listObjects, deleteObject };