import type { LoadingState } from '~/shared/types';

export enum FieldTypes {
  STRING = 'string',
  NUMBER = 'number',
  EMAIL = 'email',
  BOOLEAN = 'boolean',
}

export enum FieldCode {
  ID = 'id',
}

export interface Field {
  code: string;
  description: string;
  type: FieldTypes;
  required: boolean;
  order: number;
  min?: number;
  max?: number;
}

export interface GetMetaData {
  fields: Field[];
}

export interface TableRecord {
  [FieldCode.ID]: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface GetRecordsData {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: TableRecord[];
}

export interface TableState {
  fieldsLoadingState: LoadingState;
  recordLoadingState: LoadingState;
  fields: Field[];
  records: TableRecord[];
  prevPage: number | null;
  nextPage: number | null;
  error?: string;
}

export type CreateRecordPayload = {
  [key: string]: string | number | boolean | null | undefined;
};
