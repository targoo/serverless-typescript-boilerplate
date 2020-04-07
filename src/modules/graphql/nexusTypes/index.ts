import { asNexusMethod } from 'nexus';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLUpload } from 'graphql-upload';

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
  JobInputData,
  JobInputWhere,
  UserInputData,
  EventInputData,
  EventInputWhere,
} from './args/';

import { JobStatus } from './enums/JobStatus';
import { Feeling } from './enums/Feeling';
import { EmploymentType } from './enums/EmploymentType';
import { EventType } from './enums/EventType';

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime');
export const GQLDate = asNexusMethod(GraphQLDate, 'date');
export const GQLTime = asNexusMethod(GraphQLTime, 'time');
export const GQLJSON = asNexusMethod(GraphQLJSON, 'json');

export const types = [
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
  JobInputData,
  JobInputWhere,
  UserInputData,
  EventInputData,
  EventInputWhere,
  JobStatus,
  Feeling,
  EmploymentType,
  EventType,
  GraphQLUpload,
  GraphQLDateTime,
  GraphQLDate,
  GraphQLTime,
  GraphQLJSON,
];
