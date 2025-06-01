import { describe, expect, it } from 'vitest';

import { tableReducer } from '~/features/table';
import {
  createRecord,
  FieldTypes,
  getMetadata,
  getRecords,
} from '~/features/table/model';
import type {
  Field,
  GetMetaData,
  GetRecordsData,
  TableRecord,
  TableState,
} from '~/features/table/model/table.types';
import { LoadingState } from '~/shared/types';

const initialState: TableState = {
  fieldsLoadingState: LoadingState.IDLE,
  recordLoadingState: LoadingState.IDLE,
  fields: [],
  records: [],
  prevPage: null,
  nextPage: 1,
  error: undefined,
};

const mockField: Field = {
  code: 'fullName',
  description: 'Full Name',
  type: FieldTypes.STRING,
  required: true,
  order: 1,
};

const mockRecord: TableRecord = {
  id: '1',
  fullName: 'Иван Иванов',
  email: 'test@example.com',
  age: 25,
  isActive: true,
};

describe('tableReducer', () => {
  it('should handle getMetadata.pending', () => {
    const state = tableReducer(
      initialState,
      getMetadata.pending('', undefined),
    );
    expect(state.fieldsLoadingState).toBe(LoadingState.PENDING);
    expect(state.fields).toEqual([]);
    expect(state.error).toBeUndefined();
  });

  it('should handle getMetadata.fulfilled', () => {
    const payload: GetMetaData = { fields: [mockField] };
    const state = tableReducer(
      initialState,
      getMetadata.fulfilled(payload, '', undefined),
    );
    expect(state.fieldsLoadingState).toBe(LoadingState.FULFILLED);
    expect(state.fields).toEqual([mockField]);
    expect(state.error).toBeUndefined();
  });

  it('should handle getMetadata.rejected', () => {
    const error = 'Metadata load failed';
    const state = tableReducer(
      initialState,
      getMetadata.rejected(null, '', undefined, error),
    );
    expect(state.fieldsLoadingState).toBe(LoadingState.REJECTED);
    expect(state.error).toBe(error);
  });

  it('should handle getRecords.pending', () => {
    const state = tableReducer(
      initialState,
      getRecords.pending('', { page: 1 }),
    );
    expect(state.recordLoadingState).toBe(LoadingState.PENDING);
    expect(state.error).toBeUndefined();
  });

  it('should handle getRecords.fulfilled', () => {
    const payload: GetRecordsData = {
      first: 1,
      prev: null,
      next: 2,
      last: 5,
      pages: 5,
      items: 50,
      data: [mockRecord],
    };
    const state = tableReducer(
      initialState,
      getRecords.fulfilled(payload, '', { page: 1 }),
    );
    expect(state.recordLoadingState).toBe(LoadingState.FULFILLED);
    expect(state.records).toEqual([mockRecord]);
    expect(state.prevPage).toBe(null);
    expect(state.nextPage).toBe(2);
    expect(state.error).toBeUndefined();
  });

  it('should handle getRecords.rejected', () => {
    const error = 'Record load failed';
    const state = tableReducer(
      initialState,
      getRecords.rejected(null, '', { page: 1 }, error),
    );
    expect(state.recordLoadingState).toBe(LoadingState.REJECTED);
    expect(state.records).toEqual([]);
    expect(state.error).toBe(error);
  });

  it('should handle createRecord.pending', () => {
    const state = tableReducer(initialState, createRecord.pending('', {}));
    expect(state.error).toBeUndefined();
  });

  it('should handle createRecord.fulfilled', () => {
    const existingState = {
      ...initialState,
      records: [mockRecord],
    };
    const newRecord: TableRecord = {
      id: ' 2',
      fullName: 'Мария Смирнова',
      email: 'maria@test.com',
      age: 26,
      isActive: true,
    };
    const state = tableReducer(
      existingState,
      createRecord.fulfilled(newRecord, '', newRecord),
    );
    expect(state.records).toEqual([mockRecord, newRecord]);
    expect(state.error).toBeUndefined();
  });

  it('should handle createRecord.rejected', () => {
    const error = 'Create failed';
    const state = tableReducer(
      initialState,
      createRecord.rejected(null, '', {}, error),
    );
    expect(state.error).toBe(error);
  });
});
