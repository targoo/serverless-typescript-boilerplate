import { boardFormProperties, boardProperties, followingBoardProperties } from '../nexusTypes/Board';
import { IFollowingBoard, IKeyBase } from '../../../types/types';
import { prepareResponseDate, prepareFormInput } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import id from '../../../utils/id';
import { NexusGenRootTypes } from '../generated/nexus';

export interface BoardUtils {
  key: (userUuid: string, boardUuid: string) => IKeyBase;
  create: (userUuid: string, board: Partial<NexusGenRootTypes['Board']>) => Promise<NexusGenRootTypes['Board']>;
  get: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['Board'] | null>;
  list: (userUuid: string) => Promise<NexusGenRootTypes['Board'][]>;
  followingList: (userUuid: string) => Promise<NexusGenRootTypes['Board'][]>;
  update: (
    userUuid: string,
    boardUuid: string,
    board: Partial<NexusGenRootTypes['Board']>,
  ) => Promise<NexusGenRootTypes['Board']>;
  isFollowing: (boardUuid: string, followingUserUuid: string) => Promise<boolean>;
  follow: (userUuid: string, boardUuid: string, followingUserUuid: string) => Promise<void>;
  unfollow: (boardUuid: string, followingUserUuid: string) => Promise<void>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const BoardUtilityFactory: UtilityFactory<BoardUtils> = ({ dynamo }) => ({
  key(userUuid, boardUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `BOARD#${boardUuid}`,
    };
    return key;
  },

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

  async get(userUuid, boardUuid) {
    const { Item } = await dynamo.getItem(this.key(userUuid, boardUuid));
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['Board'];
    } else {
      return null;
    }
  },

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

  async followingList(userUuid) {
    const properties = Object.keys(followingBoardProperties);

    const params = {
      KeyConditionExpression: '#id = :id and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':id': `USER#${userUuid}`,
        ':relation': 'FOLLOWING_BOARD#',
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    let { Items } = await dynamo.query(params);

    const followingBoards = Items.map((item) => prepareResponseDate(item)).filter(
      (item) => item.isDeleted === false,
    ) as IFollowingBoard[];

    return await Promise.all(followingBoards.map(({ userUuid, boardUuid }) => this.get(userUuid, boardUuid)));
  },

  async update(userUuid, boardUuid, board) {
    const prepData = prepareFormInput(board, boardFormProperties);

    const boardFormPropertiesWithUpdateAt = [...Object.keys(prepData), 'updatedAt'];

    const UpdateExpression = boardFormPropertiesWithUpdateAt.reduce((acc, cur, index) => {
      acc = index === 0 ? `${acc} #${cur} = :${cur}` : `${acc}, #${cur} = :${cur}`;
      return acc;
    }, 'set');

    const ExpressionAttributeNames = boardFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`#${cur}`] = cur;
      return acc;
    }, {});

    const ExpressionAttributeValues = boardFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`:${cur}`] = prepData[cur] || null;
      return acc;
    }, {});

    ExpressionAttributeValues[':updatedAt'] = JSON.stringify({ format: 'date', value: new Date().toISOString() });

    const params = {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    await dynamo.updateItem(params, this.key(userUuid, boardUuid));

    return this.get(userUuid, boardUuid);
  },

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
        followingUserUuid: JSON.stringify({ format: 'string', value: followingUserUuid }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      });
    }
  },

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
