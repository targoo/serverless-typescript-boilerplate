import { FieldOutConfig } from '@nexus/schema/dist/core';

export type MutationFieldType<FieldName extends string> = FieldOutConfig<'Mutation', FieldName>;

export type QueryFieldType<FieldName extends string> = FieldOutConfig<'Query', FieldName>;
