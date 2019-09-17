export const createResponse = (statusCode, message) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  },
  body: JSON.stringify(message),
});
