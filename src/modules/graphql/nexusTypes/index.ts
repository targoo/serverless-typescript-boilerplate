import { asNexusMethod } from 'nexus';
import { GraphQLDate } from 'graphql-iso-date';
import { GraphQLUpload } from 'graphql-upload';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Board } from './Board';
import { User } from './User';
import { Job } from './Job';
import { BoardInputData, BoardInputWhere } from './args/';
import { JobStatus } from './enums/JobStatus';

export const GQLDate = asNexusMethod(GraphQLDate, 'date');
export const GQLDateTime = asNexusMethod(GraphQLDate, 'datetime');

export const types = [
  Query,
  Mutation,
  Board,
  Job,
  User,
  BoardInputData,
  BoardInputWhere,
  JobStatus,
  GraphQLUpload,
  GraphQLDate,
];
