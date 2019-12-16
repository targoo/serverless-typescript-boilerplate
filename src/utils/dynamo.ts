//https://qiita.com/daisukeArk/items/de9c92e6b650494bfb61
import AWS from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import AWSXRay from 'aws-xray-sdk';

const localConfig = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'MOCK_ACCESS_KEY_ID',
  secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
  convertEmptyValues: true,
};

const AWSConfig = {
  region: process.env.REGION || 'us-east-1',
  api_version: '2012-08-10',
};

const dynamoConfig = process.env.IS_OFFLINE ? localConfig : AWSConfig;
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

if (!process.env.IS_OFFLINE) {
  AWSXRay.captureAWS(AWS);
}

AWS.config.update(dynamoConfig);

const dynamoClient = new DynamoDB.DocumentClient();

/**
 * DynamoDB Client Abstraction
 */
const client = {
  /**
   * Save an item on DynamoDB
   */
  saveItem: (item: any, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Item: item,
    };
    console.log('params', params);

    return dynamoClient.put(params).promise();
  },

  /**
   * Find one item from DynamoDB
   */
  getItem: (key: any, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Key: key,
    };
    console.log('params', params);

    return dynamoClient.get(params).promise();
  },

  /**
   * Remove one item from DynamoDB
   */
  removeItem: (key: any, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Key: key,
      ReturnValues: 'ALL_OLD',
    };
    console.log('params', params);

    return dynamoClient.delete(params).promise();
  },

  /**
   * Update an item identified by Key
   */
  updateItem: (params, key, tableName: string = DYNAMO_TABLE) => {
    params.TableName = tableName;
    params.Key = key;
    params.ReturnValues = 'ALL_NEW';

    return dynamoClient.update(params).promise();
  },

  /**
   * Execute a Raw Select Query on DynamoTable.
   * You must inform the KeyConditionExpression and ExpressionAttributeNames
   */
  query: (where: DynamoDB.DocumentClient.QueryInput, tableName: string = DYNAMO_TABLE) => {
    where.TableName = tableName;
    return dynamoClient.query(where).promise();
  },
};

export default client;
