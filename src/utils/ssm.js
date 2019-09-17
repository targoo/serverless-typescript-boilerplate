const AWS = require('aws-sdk');

export const getFromSSM = async name => {
  const ssm = new AWS.SSM();
  const params = {
    Name: name,
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};
