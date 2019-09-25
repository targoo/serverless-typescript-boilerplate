interface IJSON {
  [key: string]: any;
}

interface IResponseOptions {
  json: IJSON;
  statusCode: number;
  allowCORS?: boolean;
  allowAuth?: boolean;
}

interface IResponse {
  statusCode: number;
  body: string;
  headers?: {
    [key: string]: string | boolean;
  };
}

function lambdaResponse({ json, statusCode, allowCORS = true, allowAuth = true }: IResponseOptions) {
  const response: IResponse = {
    statusCode,
    body: JSON.stringify(json),
    headers: {},
  };

  if (allowCORS) {
    response.headers['Access-Control-Allow-Origin'] = '*'; // Required for CORS support to work
  }

  if (allowAuth) {
    response.headers['Access-Control-Allow-Credentials'] = true; // Required for cookies, authorization headers with HTTPS
  }

  return response;
}

export function successResponse(json: IJSON) {
  return lambdaResponse({
    json,
    statusCode: 200,
  });
}

export function errorResponse(json: IJSON) {
  return lambdaResponse({
    json,
    statusCode: 500,
  });
}
