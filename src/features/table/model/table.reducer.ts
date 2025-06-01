import { createSlice } from '@reduxjs/toolkit';

import { LoadingState } from '~/shared/types';

import { createRecord, getMetadata, getRecords } from './table.actions';
import { TABLE_SLICE_NAME } from './table.const';
import type { TableState } from './table.types';

const initialState: TableState = {
  fieldsLoadingState: LoadingState.IDLE,
  recordLoadingState: LoadingState.IDLE,
  fields: [],
  records: [],
  prevPage: null,
  nextPage: 1,
  error: undefined,
};

const tableSlice = createSlice({
  name: TABLE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMetadata.pending, (state) => {
        state.fieldsLoadingState = LoadingState.PENDING;
        state.fields = [];
        state.error = undefined;
      })
      .addCase(getMetadata.fulfilled, (state, { payload }) => {
        state.fieldsLoadingState = LoadingState.FULFILLED;
        state.fields = payload.fields;
        state.error = undefined;
      })
      .addCase(getMetadata.rejected, (state, { payload }) => {
        state.error = payload;
        state.fieldsLoadingState = LoadingState.REJECTED;
      })
      .addCase(getRecords.pending, (state) => {
        state.recordLoadingState = LoadingState.PENDING;
        state.error = undefined;
      })
      .addCase(getRecords.fulfilled, (state, { payload }) => {
        state.recordLoadingState = LoadingState.FULFILLED;
        state.records = [...state.records, ...payload.data];
        state.prevPage = payload.prev;
        state.nextPage = payload.next;
        state.error = undefined;
      })
      .addCase(getRecords.rejected, (state, { payload }) => {
        state.error = payload;
        state.records = [];
        state.recordLoadingState = LoadingState.REJECTED;
      })
      .addCase(createRecord.pending, (state) => {
        state.error = undefined;
      })
      .addCase(createRecord.fulfilled, (state, { payload }) => {
        state.records = [...state.records, payload];
        state.error = undefined;
      })
      .addCase(createRecord.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const tableReducer = tableSlice.reducer;
