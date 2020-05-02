import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { boardProperties } from '../nexusTypes/Board';
import { IFollowingBoard, IKeyBase } from '../../../types/types';
import { prepareResponseDate } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import id from '../../../utils/id';
import { NexusGenRootTypes } from '../generated/nexus';

export interface BoardUtils {
  create: (userUuid: string, board: Partial<NexusGenRootTypes['Board']>) => Promise<NexusGenRootTypes['Board']>;
  get: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['Board'] | null>;
  list: (userUuid: string) => Promise<NexusGenRootTypes['Board'][]>;
  update: (
    userUuid: string,
    boardUuid: string,
    params: Omit<DocumentClient.UpdateItemInput, 'Key' | 'TableName'>,
  ) => Promise<void>;
  isFollowing: (boardUuid: string, followingUserUuid: string) => Promise<boolean>;
  follow: (userUuid: string, boardUuid: string, followingUserUuid: string) => Promise<void>;
  unfollow: (boardUuid: string, followingUserUuid: string) => Promise<void>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const BoardUtilityFactory: UtilityFactory<BoardUtils> = ({ dynamo }) => ({
  /**
   *
   * @param userUuid UUID of the owner of the board
   * @param boardUuid UUID of the board
   */
  async create(userUuid, board) {
    const uuid = id();

    await dynamo.saveItem({
      ...board,
      id: `USER#${userUuid}`,
      relation: `BOARD#${uuid}`,
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      createdBy: JSON.stringify({ format: 'string', value: userUuid }),
    });

    return this.get(uuid);
  },

  /**
   *
   * @param userUuid UUID of the owner of the board
   * @param boardUuid UUID of the board
   */
  async get(userUuid, boardUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `BOARD#${boardUuid}`,
    };
    const { Item } = await dynamo.getItem(key);
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['Board'];
    } else {
      return null;
    }
  },

  /**
   *
   * @param userUuid UUID of the owner of the board
   */
  async list(userUuid) {
    const properties = Object.keys(boardProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userUuid}`,
        ':relation': 'BOARD#',
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    const { Items: boards } = await dynamo.query(params);

    return boards.map((item) => prepareResponseDate(item)) as NexusGenRootTypes['Board'][];
  },

  /**
   *
   * @param userUuid
   * @param boardUuid
   * @param params
   */
  async update(userUuid, boardUuid, params) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `BOARD#${boardUuid}`,
    };

    await dynamo.updateItem(params, key);
  },

  /**
   *
   * @param boardUuid UUID of the board
   * @param userUuid UUID of the follower of the board
   */
  async isFollowing(boardUuid, followingUserUuid) {
    const key: IKeyBase = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_BOARD#${boardUuid}`,
    };
    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const result = prepareResponseDate(Item) as IFollowingBoard;
      return !result.isDeleted;
    } else {
      return false;
    }
  },

  /**
   *
   * @param userUuid UUID of the owner of the board
   * @param boardUuid UUID of the board
   * @param followingUserUuid UUID of the user who want to follow the board
   */
  async follow(userUuid, boardUuid, followingUserUuid) {
    const key: IKeyBase = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_BOARD#${boardUuid}`,
    };
    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const params = {
        UpdateExpression: 'set #isDeleted = :isDeleted, #updated = :updated',
        ExpressionAttributeNames: {
          '#isDeleted': 'isDeleted',
          '#updated': 'updated',
        },
        ExpressionAttributeValues: {
          ':isDeleted': JSON.stringify({ format: 'boolean', value: false }),
          ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        },
      };
      await dynamo.updateItem(params, key);
    } else {
      await dynamo.saveItem({
        id: `USER#${followingUserUuid}`,
        relation: `FOLLOWING_BOARD#${boardUuid}`,
        fid: `USER#${userUuid}`,
        userUuid: JSON.stringify({ format: 'string', value: userUuid }),
        boardUuid: JSON.stringify({ format: 'string', value: boardUuid }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      });
    }
  },

  /**
   *
   * @param boardUuid UUID of the board
   * @param followingUserUuid UUID of the user who want to follow the board
   */
  async unfollow(boardUuid, followingUserUuid) {
    const key: IKeyBase = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_BOARD#${boardUuid}`,
    };

    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const params = {
        UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
        ExpressionAttributeValues: {
          ':isDeleted': JSON.stringify({ format: 'boolean', value: true }),
          ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
        },
      };

      await dynamo.updateItem(params, key);
    }
  },
});
