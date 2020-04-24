import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import logger from './logger';
import { IEntityBase, IEntityBaseDynamo, IKeyBase, Modify } from '../types/types';

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

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
const dynamoClient = new DocumentClient(dynamoConfig);

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
  getItem: (key: IKeyBase, tableName: string = DYNAMO_TABLE): Promise<DocumentClient.GetItemOutput> => {
    const params: DocumentClient.GetItemInput = {
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
  updateItem: (
    params: Omit<DocumentClient.UpdateItemInput, 'Key' | 'TableName'>,
    key: IKeyBase,
    tableName: string = DYNAMO_TABLE,
  ): Promise<DocumentClient.UpdateItemOutput> => {
    const newParams: DocumentClient.UpdateItemInput = {
      ...params,
      TableName: tableName,
      Key: key,
      ReturnValues: 'ALL_NEW',
    };
    return dynamoClient.update(newParams).promise();
  },

  /**
   * Execute a Raw Select Query on DynamoTable.
   * You must inform the KeyConditionExpression and ExpressionAttributeNames
   */
  query: (where: any, tableName: string = DYNAMO_TABLE) => {
    where.TableName = tableName;
    return dynamoClient.query(where).promise();
  },

  /**
   * Execute a batchGetItem on DynamoTable.
   * You must inform the KeyConditionExpression and ExpressionAttributeNames
   */
  batchGetItem: (where: any, tableName: string = DYNAMO_TABLE) => {
    where.TableName = tableName;
    return dynamoClient.batchGet(where).promise();
  },
};

export default client;
