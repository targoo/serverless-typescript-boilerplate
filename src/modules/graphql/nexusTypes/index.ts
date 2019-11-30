import { Query } from './Query';
import { Mutation } from './Mutation';
import { Board } from './Board';
import { Job } from './Job';
import { BoardInput } from './args/';
import { BoardStatus } from './enums/BoardStatus';
import { JobStatus } from './enums/JobStatus';

export const types = [Query, Mutation, Board, Job, BoardInput, BoardStatus, JobStatus];
