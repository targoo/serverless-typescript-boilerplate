/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import { core } from 'nexus';
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    datetime<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.ScalarInputFieldConfig<core.GetGen3<'inputTypes', TypeName, FieldName>>,
    ): void; // "DateTime";
    date<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.ScalarInputFieldConfig<core.GetGen3<'inputTypes', TypeName, FieldName>>,
    ): void; // "Date";
    time<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.ScalarInputFieldConfig<core.GetGen3<'inputTypes', TypeName, FieldName>>,
    ): void; // "Time";
    json<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.ScalarInputFieldConfig<core.GetGen3<'inputTypes', TypeName, FieldName>>,
    ): void; // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "DateTime";
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Date";
    time<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Time";
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "JSON";
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  BoardInputData: {
    // input type
    availableDate?: any | null; // Date
    description?: string | null; // String
    isDeleted?: boolean | null; // Boolean
    location?: string | null; // String
    title: string; // String!
  };
  BoardInputWhere: {
    // input type
    isDeleted?: boolean | null; // Boolean
  };
  EventInputData: {
    // input type
    date?: any | null; // DateTime
    description?: string | null; // String
    type?: NexusGenEnums['EventType'] | null; // EventType
  };
  EventInputWhere: {
    // input type
    boardUuid: string; // ID!
    isDeleted?: boolean | null; // Boolean
    jobUuid: string; // ID!
  };
  JobInputData: {
    // input type
    agencyName?: string | null; // String
    agentEmail?: string | null; // String
    agentName?: string | null; // String
    agentPhone?: string | null; // String
    company?: string | null; // String
    companyLocation?: string | null; // String
    companyWebsite?: string | null; // String
    duration?: string | null; // String
    employmentType?: NexusGenEnums['EmploymentType'] | null; // EmploymentType
    feeling?: NexusGenEnums['Feeling'] | null; // Feeling
    ir35?: boolean | null; // Boolean
    isDeleted?: boolean | null; // Boolean
    jobDescription?: string | null; // String
    jobTitle?: string | null; // String
    rate?: string | null; // String
    status?: NexusGenEnums['JobStatus'] | null; // JobStatus
  };
  JobInputWhere: {
    // input type
    boardUuid: string; // ID!
    isDeleted?: boolean | null; // Boolean
  };
  UserInputData: {
    // input type
    name?: string | null; // String
  };
}

export interface NexusGenEnums {
  EmploymentType: 'CONTRACT' | 'PERMANENT';
  EventType: 'CALL' | 'FACE2FACE' | 'ONLINETEST' | 'VIDEOCALL';
  Feeling: 'ECSTATIC' | 'HAPPY' | 'NORMAL' | 'SAD';
  JobStatus: 'ACTIVE' | 'ARCHIVED';
}

export interface NexusGenRootTypes {
  Autho0User: {
    // root type
    email?: string | null; // String
    email_verified?: boolean | null; // Boolean
    jwt: string; // String!
    name?: string | null; // String
    nickname?: string | null; // String
    picture?: string | null; // String
    uuid: string; // ID!
  };
  Board: {
    // root type
    availableDate?: any | null; // Date
    createdAt: any; // DateTime!
    description?: string | null; // String
    isDeleted: boolean; // Boolean!
    location?: string | null; // String
    title: string; // String!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  };
  Event: {
    // root type
    createdAt: any; // DateTime!
    date: any; // DateTime!
    description: string; // String!
    isDeleted: boolean; // Boolean!
    type: NexusGenEnums['EventType']; // EventType!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  };
  File: {
    // root type
    encoding: string; // String!
    filename: string; // String!
    id: string; // ID!
    mimetype: string; // String!
  };
  Job: {
    // root type
    agencyName?: string | null; // String
    agentEmail?: string | null; // String
    agentName?: string | null; // String
    agentPhone?: string | null; // String
    company?: string | null; // String
    companyLocation?: string | null; // String
    companyWebsite?: string | null; // String
    createdAt: any; // DateTime!
    duration?: string | null; // String
    employmentType?: NexusGenEnums['EmploymentType'] | null; // EmploymentType
    feeling: NexusGenEnums['Feeling']; // Feeling!
    ir35?: boolean | null; // Boolean
    isDeleted: boolean; // Boolean!
    jobDescription?: string | null; // String
    jobTitle?: string | null; // String
    rate?: string | null; // String
    status: NexusGenEnums['JobStatus']; // JobStatus!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  };
  Mutation: {};
  Query: {};
  User: {
    // root type
    createdAt: any; // DateTime!
    email: string; // String!
    isDeleted: boolean; // Boolean!
    nickname: string; // String!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  };
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  Date: any;
  DateTime: any;
  JSON: any;
  Time: any;
  Upload: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  BoardInputData: NexusGenInputs['BoardInputData'];
  BoardInputWhere: NexusGenInputs['BoardInputWhere'];
  EventInputData: NexusGenInputs['EventInputData'];
  EventInputWhere: NexusGenInputs['EventInputWhere'];
  JobInputData: NexusGenInputs['JobInputData'];
  JobInputWhere: NexusGenInputs['JobInputWhere'];
  UserInputData: NexusGenInputs['UserInputData'];
  EmploymentType: NexusGenEnums['EmploymentType'];
  EventType: NexusGenEnums['EventType'];
  Feeling: NexusGenEnums['Feeling'];
  JobStatus: NexusGenEnums['JobStatus'];
}

export interface NexusGenFieldTypes {
  Autho0User: {
    // field return type
    email: string | null; // String
    email_verified: boolean | null; // Boolean
    jwt: string; // String!
    name: string | null; // String
    nickname: string | null; // String
    picture: string | null; // String
    uuid: string; // ID!
  };
  Board: {
    // field return type
    availableDate: any | null; // Date
    createdAt: any; // DateTime!
    description: string | null; // String
    isDeleted: boolean; // Boolean!
    location: string | null; // String
    title: string; // String!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  };
  Event: {
    // field return type
    createdAt: any; // DateTime!
    date: any; // DateTime!
    description: string; // String!
    isDeleted: boolean; // Boolean!
    type: NexusGenEnums['EventType']; // EventType!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  };
  File: {
    // field return type
    encoding: string; // String!
    filename: string; // String!
    id: string; // ID!
    mimetype: string; // String!
  };
  Job: {
    // field return type
    agencyName: string | null; // String
    agentEmail: string | null; // String
    agentName: string | null; // String
    agentPhone: string | null; // String
    company: string | null; // String
    companyLocation: string | null; // String
    companyWebsite: string | null; // String
    createdAt: any; // DateTime!
    duration: string | null; // String
    employmentType: NexusGenEnums['EmploymentType'] | null; // EmploymentType
    feeling: NexusGenEnums['Feeling']; // Feeling!
    ir35: boolean | null; // Boolean
    isDeleted: boolean; // Boolean!
    jobDescription: string | null; // String
    jobTitle: string | null; // String
    rate: string | null; // String
    status: NexusGenEnums['JobStatus']; // JobStatus!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  };
  Mutation: {
    // field return type
    archiveBoard: NexusGenRootTypes['Board']; // Board!
    archiveJob: NexusGenRootTypes['Job']; // Job!
    createBoard: NexusGenRootTypes['Board']; // Board!
    createJob: NexusGenRootTypes['Job']; // Job!
    passwordlessSignIn: boolean; // Boolean!
    passwordlessSignInConfirm: NexusGenRootTypes['Autho0User']; // Autho0User!
    updateBoard: NexusGenRootTypes['Board']; // Board!
    updateJob: NexusGenRootTypes['Job']; // Job!
    updateUser: NexusGenRootTypes['User']; // User!
    uploadFile: NexusGenRootTypes['File']; // File!
  };
  Query: {
    // field return type
    board: NexusGenRootTypes['Board']; // Board!
    boards: NexusGenRootTypes['Board'][]; // [Board!]!
    hello: string; // String!
    job: NexusGenRootTypes['Job']; // Job!
    jobs: NexusGenRootTypes['Job'][]; // [Job!]!
    me: NexusGenRootTypes['User']; // User!
  };
  User: {
    // field return type
    createdAt: any; // DateTime!
    email: string; // String!
    isDeleted: boolean; // Boolean!
    nickname: string; // String!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    archiveBoard: {
      // args
      uuid: string; // ID!
    };
    archiveJob: {
      // args
      boardUuid: string; // ID!
      uuid: string; // ID!
    };
    createBoard: {
      // args
      data: NexusGenInputs['BoardInputData']; // BoardInputData!
    };
    createJob: {
      // args
      boardUuid: string; // ID!
      data: NexusGenInputs['JobInputData']; // JobInputData!
    };
    passwordlessSignIn: {
      // args
      email: string; // String!
    };
    passwordlessSignInConfirm: {
      // args
      accessToken: string; // String!
      state: string; // String!
    };
    updateBoard: {
      // args
      data: NexusGenInputs['BoardInputData']; // BoardInputData!
      uuid: string; // ID!
    };
    updateJob: {
      // args
      boardUuid: string; // ID!
      data: NexusGenInputs['JobInputData']; // JobInputData!
      uuid: string; // ID!
    };
    updateUser: {
      // args
      data: NexusGenInputs['UserInputData']; // UserInputData!
    };
    uploadFile: {
      // args
      file: any; // Upload!
    };
  };
  Query: {
    board: {
      // args
      uuid: string; // ID!
    };
    boards: {
      // args
      where?: NexusGenInputs['BoardInputWhere'] | null; // BoardInputWhere
    };
    hello: {
      // args
      name?: string | null; // String
    };
    job: {
      // args
      boardUuid: string; // ID!
      uuid: string; // ID!
    };
    jobs: {
      // args
      where: NexusGenInputs['JobInputWhere']; // JobInputWhere!
    };
  };
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = 'Autho0User' | 'Board' | 'Event' | 'File' | 'Job' | 'Mutation' | 'Query' | 'User';

export type NexusGenInputNames =
  | 'BoardInputData'
  | 'BoardInputWhere'
  | 'EventInputData'
  | 'EventInputWhere'
  | 'JobInputData'
  | 'JobInputWhere'
  | 'UserInputData';

export type NexusGenEnumNames = 'EmploymentType' | 'EventType' | 'Feeling' | 'JobStatus';

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames =
  | 'Boolean'
  | 'Date'
  | 'DateTime'
  | 'Float'
  | 'ID'
  | 'Int'
  | 'JSON'
  | 'String'
  | 'Time'
  | 'Upload';

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes'];
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginSchemaConfig {}
}
