import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World 2026!' }),
  };
};

export const sendData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const envVars = process.env;

  return {
    statusCode: 200,
    body: JSON.stringify({
      environment: envVars,
    })
  };
};