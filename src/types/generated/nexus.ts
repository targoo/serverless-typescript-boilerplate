/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  BoardInput: {
    // input type
    title: string; // String!
  };
}

export interface NexusGenEnums {
  BoardStatus: 'ACTIVE' | 'ARCHIVED';
  JobStatus: 'ARCHIVED' | 'PENDING';
}

export interface NexusGenRootTypes {
  Board: {
    // root type
    jobs?: NexusGenRootTypes['Job'][] | null; // [Job!]
    status: NexusGenEnums['BoardStatus']; // BoardStatus!
    title: string; // String!
    uuid: string; // ID!
  };
  Job: {
    // root type
    uuid: string; // ID!
  };
  Mutation: {};
  Query: {};
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  BoardInput: NexusGenInputs['BoardInput'];
  BoardStatus: NexusGenEnums['BoardStatus'];
  JobStatus: NexusGenEnums['JobStatus'];
}

export interface NexusGenFieldTypes {
  Board: {
    // field return type
    jobs: NexusGenRootTypes['Job'][] | null; // [Job!]
    status: NexusGenEnums['BoardStatus']; // BoardStatus!
    title: string; // String!
    uuid: string; // ID!
  };
  Job: {
    // field return type
    uuid: string; // ID!
  };
  Mutation: {
    // field return type
    createBoard: NexusGenRootTypes['Board']; // Board!
    updateBoard: NexusGenRootTypes['Board']; // Board!
  };
  Query: {
    // field return type
    board: NexusGenRootTypes['Board']; // Board!
    boards: NexusGenRootTypes['Board'][]; // [Board!]!
    hello: string; // String!
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    createBoard: {
      // args
      input: NexusGenInputs['BoardInput']; // BoardInput!
    };
    updateBoard: {
      // args
      input: NexusGenInputs['BoardInput']; // BoardInput!
      uuid: string; // ID!
    };
  };
  Query: {
    hello: {
      // args
      name?: string | null; // String
    };
  };
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = 'Board' | 'Job' | 'Mutation' | 'Query';

export type NexusGenInputNames = 'BoardInput';

export type NexusGenEnumNames = 'BoardStatus' | 'JobStatus';

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = 'Boolean' | 'Float' | 'ID' | 'Int' | 'String';

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
