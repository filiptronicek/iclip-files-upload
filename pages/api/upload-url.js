import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {

  const { file, fileType } = req.query;

  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const ep = new aws.Endpoint(`s3.${process.env.REGION}.wasabisys.com`);
  const s3 = new aws.S3({ endpoint: ep });
  const fileExt = file.split('.').pop();
  console.log(`${uuidv4()}.${fileExt}`);
  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `${uuidv4()}.${fileExt}`,
      "Content-Type": fileType,
      //"Content-Disposition": `attachment; filename="${file}"` // TODO: preserve filenames
    },
    Expires: 60,
    Conditions: [
      [
        'content-length-range', 0, 8.59e9 // up to 1 GiB
      ],
    ],
  });

  res.status(200).json(post);
}
