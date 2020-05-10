import { prepareResponseDate } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import { NexusGenRootTypes } from '../generated/nexus';
import { fileProperties } from '../nexusTypes/File';

export interface FileUtils {
  list: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['File'][]>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const FileUtilityFactory: UtilityFactory<FileUtils> = ({ dynamo }) => ({
  async list(userUuid, boardUuid) {
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
});
