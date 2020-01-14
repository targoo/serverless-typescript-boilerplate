import { asNexusMethod } from 'nexus';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLUpload } from 'graphql-upload';

import { Query } from './Query';
import { Mutation } from './Mutation';
import { Board } from './Board';
import { User } from './User';
import { Job } from './Job';
import { BoardInputData, BoardInputWhere, JobInputData, JobInputWhere } from './args/';
import { JobStatus } from './enums/JobStatus';

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime');
export const GQLDate = asNexusMethod(GraphQLDate, 'date');
export const GQLTime = asNexusMethod(GraphQLTime, 'time');
export const GQLJSON = asNexusMethod(GraphQLJSON, 'json');

export const types = [
  Query,
  Mutation,
  Board,
  Job,
  User,
  BoardInputData,
  BoardInputWhere,
  JobInputData,
  JobInputWhere,
  JobStatus,
  GraphQLUpload,
  GraphQLDateTime,
  GraphQLDate,
  GraphQLTime,
  GraphQLJSON,
];
