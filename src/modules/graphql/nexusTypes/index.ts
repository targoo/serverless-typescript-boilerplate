import { Query } from './Query';
import { Mutation } from './Mutation';
import { Board } from './Board';
import { User } from './User';
import { Job } from './Job';
import { BoardInput, BoardInputWhere } from './args/';
import { JobStatus } from './enums/JobStatus';

export const types = [Query, Mutation, Board, Job, User, BoardInput, BoardInputWhere, JobStatus];
