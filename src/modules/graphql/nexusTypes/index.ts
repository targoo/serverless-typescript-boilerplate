import { asNexusMethod, scalarType } from 'nexus';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

import { Query } from './Query';
import { Mutation } from './Mutation';

import { Board } from './Board';
import { User } from './User';
import { Autho0User } from './Autho0User';
import { Job } from './Job';
import { File } from './File';
import { Event } from './Event';

import {
  BoardInputData,
  BoardInputWhere,
  BoardInputSort,
  JobInputData,
  JobInputWhere,
  UserInputData,
  EventInputData,
  EventInputWhere,
} from './args/';

import {
  JobStatus,
  Feeling,
  EmploymentType,
  EventType,
  SortDirection,
  EducationLevel,
  InterestLevel,
  RemoteOptions,
} from './enums';

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime');
export const GQLDate = asNexusMethod(GraphQLDate, 'date');
export const GQLTime = asNexusMethod(GraphQLTime, 'time');
export const GQLJSON = asNexusMethod(GraphQLJSON, 'json');

// The default UPLOAD scalar does not work.
const Upload = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload',
  description: 'Upload custom scalar type - fixed',
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    return null;
  },
});

export const types = [
  Upload,
  Query,
  Mutation,
  Board,
  Job,
  Event,
  User,
  Autho0User,
  File,
  BoardInputData,
  BoardInputWhere,
  BoardInputSort,
  JobInputData,
  JobInputWhere,
  UserInputData,
  EventInputData,
  EventInputWhere,
  JobStatus,
  Feeling,
  EmploymentType,
  EventType,
  SortDirection,
  EducationLevel,
  InterestLevel,
  RemoteOptions,
  GraphQLDateTime,
  GraphQLDate,
  GraphQLTime,
  GraphQLJSON,
];
