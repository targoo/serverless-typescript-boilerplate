import { IJob } from '../../../types/types';
import { prepareResponseDate } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';

export interface JobUtils {
  get: (userUuid: string, boardUuid: string, jobUuid: string) => Promise<IJob | null>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const JobUtilityFactory: UtilityFactory<JobUtils> = ({ dynamo }) => ({
  /**
   *
   * @param userUuid
   * @param boardUuid
   * @param jobUuid
   */
  async get(userUuid, boardUuid, jobUuid) {
    const key = {
      id: `USER#${userUuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
    };
    const { Item } = await dynamo.getItem(key);
    if (Item) {
      return prepareResponseDate(Item) as IJob;
    } else {
      return null;
    }
  },
});
