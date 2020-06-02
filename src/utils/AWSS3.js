

const configS3 = {
    bucketName: "demo-app-cl",
    dirName: "demo-app",
    region: "ap-southeast-1",
    accessKeyId: process.env.REACT_APP_S3CLIENT,
    secretAccessKey: process.env.REACT_APP_S3KEY,
  };



export default configS3;