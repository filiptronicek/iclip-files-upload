import aws from "aws-sdk";
import getUserId from "../../lib/randID";
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  const { file, fileType } = req.query;

  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: "v4",
  });

  const ep = new aws.Endpoint(`s3.${process.env.REGION}.wasabisys.com`);
  const s3 = new aws.S3({ endpoint: ep });
  const fileExt = file.split(".").pop();

  const fileSizeLimit = session ? 1e10 : 1e8; // up to 10 GB if authenthicated

  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `${getUserId(7)}.${fileExt}`,
      "Content-Type": fileType,
      //"Content-Disposition": `attachment; filename="${file}"` // TODO: preserve filenames
    },
    Expires: 60,
    Conditions: [
      [
        "content-length-range",
        0,
        fileSizeLimit
      ],
    ],
  });

  console.log(session ? "Authed" : "Unauthed");
  res.status(200).json(post);
}
