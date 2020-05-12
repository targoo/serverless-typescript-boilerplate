import { prepareResponseDate, prepareFormInput } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import { NexusGenRootTypes } from '../generated/nexus';
import { fileProperties, fileFormProperties } from '../nexusTypes/File';
import { IKeyBase } from '../../../types/types';

export interface FileUtils {
  boardKey: (userUuid: string, boardUuid: string, fileUuid: string) => IKeyBase;
  jobKey: (userUuid: string, boardUuid: string, jobUuid: string, fileUuid: string) => IKeyBase;
  boardCreate: (
    userUuid: string,
    boardUuid: string,
    fileUuid: string,
    file: Partial<NexusGenRootTypes['File']>,
  ) => Promise<NexusGenRootTypes['File']>;
  jobCreate: (
    userUuid: string,
    boardUuid: string,
    jobUuid: string,
    fileUuid: string,
    file: Partial<NexusGenRootTypes['File']>,
  ) => Promise<NexusGenRootTypes['File']>;
  boardGet: (userUuid: string, boardUuid: string, fileUuid: string) => Promise<NexusGenRootTypes['File'] | null>;
  boardDownload: (userUuid: string, boardUuid: string, fileUuid: string) => void;
  jobGet: (
    userUuid: string,
    boardUuid: string,
    jobUuid: string,
    fileUuid: string,
  ) => Promise<NexusGenRootTypes['File'] | null>;
  boardList: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['File'][]>;
  jobList: (userUuid: string, boardUuid: string, jobUuid: string) => Promise<NexusGenRootTypes['File'][]>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const FileUtilityFactory: UtilityFactory<FileUtils> = ({ dynamo }) => ({
  boardKey(userUuid, boardUuid, fileUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `FILE#BOARD#${boardUuid}#${fileUuid}`,
    };
    return key;
  },

  jobKey(userUuid, boardUuid, jobUuid, fileUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `FILE#JOB#${boardUuid}#JOB#${jobUuid}#${fileUuid}`,
    };
    return key;
  },

  async boardCreate(userUuid, boardUuid, fileUuid, file) {
    await dynamo.saveItem({
      ...prepareFormInput(file, fileFormProperties),
      ...this.boardKey(userUuid, boardUuid, fileUuid),
      uuid: JSON.stringify({ format: 'string', value: fileUuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    });

    return this.boardGet(userUuid, boardUuid, fileUuid);
  },

  async jobCreate(userUuid, boardUuid, jobUuid, fileUuid, file) {
    await dynamo.saveItem({
      ...prepareFormInput(file, fileFormProperties),
      ...this.jobKey(userUuid, boardUuid, jobUuid, fileUuid),
      uuid: JSON.stringify({ format: 'string', value: fileUuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    });

    return this.jobGet(userUuid, boardUuid, jobUuid, fileUuid);
  },

  async boardGet(userUuid, boardUuid, fileUuid) {
    const { Item } = await dynamo.getItem(this.boardKey(userUuid, boardUuid, fileUuid));
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['File'];
    } else {
      return null;
    }
  },

  async boardDownload(userUuid, boardUuid, fileUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `FILE#DOWNLOAD#${boardUuid}#${fileUuid}`,
    };

    await dynamo.saveItem({
      ...key,
      uuid: JSON.stringify({ format: 'string', value: fileUuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    });
  },

  async jobGet(userUuid, boardUuid, jobUuid, fileUuid) {
    const { Item } = await dynamo.getItem(this.jobKey(userUuid, boardUuid, jobUuid, fileUuid));
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['File'];
    } else {
      return null;
    }
  },

  async boardList(userUuid, boardUuid) {
    const properties = Object.keys(fileProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userUuid}`,
        ':relation': `FILE#BOARD#${boardUuid}`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    let { Items: files } = await dynamo.query(params);

    return files
      .map((item) => prepareResponseDate(item))
      .filter((item) => item.isDeleted === false) as NexusGenRootTypes['File'][];
  },

  async jobList(userUuid, boardUuid, jobUuid) {
    const properties = Object.keys(fileProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userUuid}`,
        ':relation': `FILE#JOB#${boardUuid}#${jobUuid}`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    let { Items: files } = await dynamo.query(params);

    return files
      .map((item) => prepareResponseDate(item))
      .filter((item) => item.isDeleted === false) as NexusGenRootTypes['File'][];
  },
});
