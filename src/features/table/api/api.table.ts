import { axiosInstance } from '~/api';
import type {
  CreateRecordPayload,
  GetMetaData,
  GetRecordsData,
  TableRecord,
} from '~/features/table/model';

import { CREATE_RECORD, GET_METADATA, GET_RECORDS } from './api.const';

export const getMetadata = async (): Promise<GetMetaData> => {
  const { data } = await axiosInstance.get<GetMetaData>(GET_METADATA);

  return data;
};

export const getRecords = async (page: number): Promise<GetRecordsData> => {
  const { data } = await axiosInstance.get<GetRecordsData>(GET_RECORDS(page));

  return data;
};

export const createRecord = async (
  record: CreateRecordPayload,
): Promise<TableRecord> => {
  const { data } = await axiosInstance.post<TableRecord>(CREATE_RECORD, record);

  return data;
};
