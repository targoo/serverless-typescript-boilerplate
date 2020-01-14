/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */


import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "DateTime";
    date<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "Date";
    time<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "Time";
    json<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    time<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Time";
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  BoardInputData: { // input type
    title: string; // String!
  }
  BoardInputWhere: { // input type
    isDeleted?: boolean | null; // Boolean
  }
  JobInputData: { // input type
    boardUUID: string; // ID!
    title: string; // String!
  }
  JobInputWhere: { // input type
    isDeleted?: boolean | null; // Boolean
  }
}

export interface NexusGenEnums {
  JobStatus: "ACTIVE" | "ARCHIVED"
}

export interface NexusGenRootTypes {
  Board: { // root type
    createdAt: any; // DateTime!
    date?: any | null; // Date
    isDeleted: boolean; // Boolean!
    json?: any | null; // JSON
    time?: any | null; // Time
    title: string; // String!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  }
  Job: { // root type
    createdAt: any; // DateTime!
    isDeleted: boolean; // Boolean!
    status: NexusGenEnums['JobStatus']; // JobStatus!
    title: string; // String!
    updatedAt?: any | null; // DateTime
    uuid: string; // ID!
  }
  Mutation: {};
  Query: {};
  User: { // root type
    email: string; // String!
    username: string; // String!
    uuid: string; // ID!
  }
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
  JobInputData: NexusGenInputs['JobInputData'];
  JobInputWhere: NexusGenInputs['JobInputWhere'];
  JobStatus: NexusGenEnums['JobStatus'];
}

export interface NexusGenFieldTypes {
  Board: { // field return type
    createdAt: any; // DateTime!
    date: any | null; // Date
    isDeleted: boolean; // Boolean!
    jobs: NexusGenRootTypes['Job'][] | null; // [Job!]
    json: any | null; // JSON
    time: any | null; // Time
    title: string; // String!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  }
  Job: { // field return type
    board: NexusGenRootTypes['Board'] | null; // Board
    createdAt: any; // DateTime!
    isDeleted: boolean; // Boolean!
    status: NexusGenEnums['JobStatus']; // JobStatus!
    title: string; // String!
    updatedAt: any | null; // DateTime
    uuid: string; // ID!
  }
  Mutation: { // field return type
    archiveBoard: NexusGenRootTypes['Board']; // Board!
    createBoard: NexusGenRootTypes['Board']; // Board!
    createJob: NexusGenRootTypes['Job']; // Job!
    updateBoard: NexusGenRootTypes['Board']; // Board!
  }
  Query: { // field return type
    board: NexusGenRootTypes['Board']; // Board!
    boards: NexusGenRootTypes['Board'][]; // [Board!]!
    hello: string; // String!
    jobs: NexusGenRootTypes['Job'][]; // [Job!]!
  }
  User: { // field return type
    email: string; // String!
    username: string; // String!
    uuid: string; // ID!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    archiveBoard: { // args
      uuid: string; // ID!
    }
    createBoard: { // args
      data: NexusGenInputs['BoardInputData']; // BoardInputData!
    }
    createJob: { // args
      data: NexusGenInputs['JobInputData']; // JobInputData!
    }
    updateBoard: { // args
      data: NexusGenInputs['BoardInputData']; // BoardInputData!
      uuid: string; // ID!
    }
  }
  Query: {
    board: { // args
      uuid: string; // String!
    }
    boards: { // args
      where?: NexusGenInputs['BoardInputWhere'] | null; // BoardInputWhere
    }
    hello: { // args
      name?: string | null; // String
    }
    jobs: { // args
      where?: NexusGenInputs['JobInputWhere'] | null; // JobInputWhere
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Board" | "Job" | "Mutation" | "Query" | "User";

export type NexusGenInputNames = "BoardInputData" | "BoardInputWhere" | "JobInputData" | "JobInputWhere";

export type NexusGenEnumNames = "JobStatus";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Date" | "DateTime" | "Float" | "ID" | "Int" | "JSON" | "String" | "Time" | "Upload";

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
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}