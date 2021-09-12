import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const ep = new aws.Endpoint(`s3.${process.env.REGION}.wasabisys.com`);
  const s3 = new aws.S3({endpoint: ep});
  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60,
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}
