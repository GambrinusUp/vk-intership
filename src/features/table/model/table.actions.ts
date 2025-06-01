import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { TableHTTP } from '../api';
import {
  CREATE_RECORD_ACTION_NAME,
  GET_METADATA_ACTION_NAME,
  GET_RECORDS_ACTION_NAME,
} from './table.const';
import type {
  CreateRecordPayload,
  GetMetaData,
  GetRecordsData,
  TableRecord,
} from './table.types';

export const getMetadata = createAsyncThunk<
  GetMetaData,
  void,
  { rejectValue: string }
>(GET_METADATA_ACTION_NAME, async (_, { rejectWithValue }) => {
  try {
    return await TableHTTP.getMetadata();
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getRecords = createAsyncThunk<
  GetRecordsData,
  { page: number },
  { rejectValue: string }
>(GET_RECORDS_ACTION_NAME, async ({ page }, { rejectWithValue }) => {
  try {
    return await TableHTTP.getRecords(page);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const createRecord = createAsyncThunk<
  TableRecord,
  CreateRecordPayload,
  { rejectValue: string }
>(CREATE_RECORD_ACTION_NAME, async (newRecord, { rejectWithValue }) => {
  try {
    return await TableHTTP.createRecord(newRecord);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});
