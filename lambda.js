const AWS = require("aws-sdk");
AWS.config.update({region: process.env.REGION || "eu-west-2"})
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const result = await getUploadURL(event);
  return result;
}

const getUploadURL = async (event) => {
  const s3Params = {
    Bucket: 'council-tax-upload-ons',
    Key:  event.queryStringParameters.filename,
    ContentType: "text/csv",
    Expires: 60,
    ACL: 'public-read'
  }
  console.log("filename: " + event.filename)
  return new Promise((resolve, reject) => {
    let uploadURL = s3.getSignedUrl('putObject', s3Params)
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": { 'Access-Control-Allow-Origin': '*',
                    //'Access-Control-Allow-Headers': '*',
                    //'Access-Control-Allow-Methods': 'GET, OPTIONS'
         },
      "body": JSON.stringify({
        "uploadURL": uploadURL,
        "filename": event.queryStringParameters.filename
      })
    })
  })
};
