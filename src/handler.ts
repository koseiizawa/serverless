import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { KMSClient, SignCommand, GetPublicKeyCommand } from '@aws-sdk/client-kms';

const kms = new KMSClient({ region: 'us-east-1' });

export const sign = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const body = event.body ? JSON.parse(event.body) : {};
  const data = body.data;

  if (!data) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'data is required' }),
    };
  }

  // Sign data
  const signResponse = await kms.send(new SignCommand({
    KeyId: process.env.TRANSMITTER_KEY_ID!,
    Message: Buffer.from(data),
    MessageType: 'RAW',
    SigningAlgorithm: 'ECDSA_SHA_256',
  }));

  // Get public key
  const publicKeyResponse = await kms.send(new GetPublicKeyCommand({
    KeyId: process.env.TRANSMITTER_KEY_ID!,
  }));

  const signature = Buffer.from(signResponse.Signature!).toString('hex');
  const publicKey = Buffer.from(publicKeyResponse.PublicKey!).toString('hex');

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
      signature,
      publicKey,
    }),
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