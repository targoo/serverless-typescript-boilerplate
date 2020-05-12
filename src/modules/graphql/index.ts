import logger from '../../utils/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { verify, decode } from '../../utils/jwt';
import dynamo from '../../utils/dynamo';
import s3 from '../../utils/s3';
import { emailService, EmailService } from '../../utils/emailService';
import { IKeyBase } from '../../types/types';
import { UserUtilityFactory, UserUtils } from './utility/userFactory';
import { BoardUtilityFactory, BoardUtils } from './utility/boardFactory';
import { JobUtilityFactory, JobUtils } from './utility/jobFactory';
import { FileUtilityFactory, FileUtils } from './utility/fileFactory';
import { EventUtilityFactory, EventUtils } from './utility/eventFactory';

// Infers the resolve type of a promise
type ThenArg<T> = T extends Promise<infer U> ? U : T;

export interface ContextParameters {
  event: APIGatewayProxyEvent;
  context: Context;
}

export interface GraphQLContext extends ContextParameters {
  utils: {
    userfactory: UserUtils;
    boardfactory: BoardUtils;
    jobfactory: JobUtils;
    filefactory: FileUtils;
    eventfactory: EventUtils;
  };
  dynamo: {
    getItem: (key: IKeyBase, tableName?: string) => ReturnType<typeof dynamo.getItem>;
    saveItem: any;
    removeItem: any;
    updateItem: (
      params: Omit<DocumentClient.UpdateItemInput, 'Key' | 'TableName'>,
      key: IKeyBase,
      tableName?: string,
    ) => ReturnType<typeof dynamo.updateItem>;
    query: any;
  };
  s3: any;
  emailService: EmailService;
  user: {
    sub: string;
    uuid: string;
    email: string;
    email_verified: boolean;
    nickname: string;
    name: string;
    state: string;
    picture: string;
    iat: number;
    exp: number;
    audience: String;
    issuer: string;
  } | null;
}

export type ContextType = ThenArg<ReturnType<typeof getContext>>;

export const getContext = async ({ event, context }: ContextParameters): Promise<GraphQLContext> => {
  const {
    headers: { Authorization },
  } = event;

  const isTokenValid = verify(Authorization);

  const user = isTokenValid ? decode(Authorization) : null;

  return {
    utils: {
      userfactory: UserUtilityFactory({ dynamo }),
      boardfactory: BoardUtilityFactory({ dynamo }),
      jobfactory: JobUtilityFactory({ dynamo }),
      filefactory: FileUtilityFactory({ dynamo }),
      eventfactory: EventUtilityFactory({ dynamo }),
    },
    event,
    context,
    dynamo,
    s3,
    user,
    emailService,
  };
};
