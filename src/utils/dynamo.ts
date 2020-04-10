import AWS from 'aws-sdk';
// import { captureAWS } from 'aws-xray-sdk-core';

import logger from './logger';

import { IEntityBase, IEntityBaseDynamo, IKeyBase, Modify } from '../types/types';

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

const dynamoConfig = process.env.ENV === 'local' ? localConfig : AWSConfig;
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

AWS.config.update(dynamoConfig);

const dynamoClient = new AWS.DynamoDB.DocumentClient();

/**
 * DynamoDB Client Abstraction
 */
const client = {
  /**
   * Save an item on DynamoDB
   */
  saveItem: (item: IEntityBase, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Item: item,
    };
    logger.debug(`Dynamo: saveItem : params: ${JSON.stringify(params)}`);

    return dynamoClient.put(params).promise();
  },

  /**
   * Find one item from DynamoDB
   */
  getItem: (key: IKeyBase, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Key: key,
    };

    return dynamoClient.get(params).promise();
  },

  /**
   * Remove one item from DynamoDB
   */
  removeItem: (key: IKeyBase, tableName: string = DYNAMO_TABLE) => {
    const params = {
      TableName: tableName,
      Key: key,
      ReturnValues: 'ALL_OLD',
    };

    return dynamoClient.delete(params).promise();
  },

  /**
   * Update an item identified by Key
   */
  updateItem: (params, key: IKeyBase, tableName: string = DYNAMO_TABLE) => {
    params.TableName = tableName;
    params.Key = key;
    params.ReturnValues = 'ALL_NEW';
    logger.debug(`params: ${JSON.stringify(params)}`);

    return dynamoClient.update(params).promise();
  },

  /**
   * Execute a Raw Select Query on DynamoTable.
   * You must inform the KeyConditionExpression and ExpressionAttributeNames
   */
  query: (where: any, tableName: string = DYNAMO_TABLE) => {
    where.TableName = tableName;
    return dynamoClient.query(where).promise();
  },
};

export default client;
