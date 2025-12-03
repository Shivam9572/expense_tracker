const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
module.exports.upload=async (data, fileName) => {
    try {
        const s3Client = new S3Client({
            region: "ap-south-1",       // replace with your region
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        let awsResponse = await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: data,
                ACL: "public-read"
            }),
        );

        return JSON.stringify(awsResponse);

    } catch (error) {
        console.log(error);
        return error;
    }
}