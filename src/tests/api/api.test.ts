import { beforeEach, describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '~/api';
import {
  CREATE_RECORD,
  GET_METADATA,
  GET_RECORDS,
} from '~/features/table/api/api.const';
import {
  createRecord,
  getMetadata,
  getRecords,
} from '~/features/table/api/api.table';

vi.mock('~/api');

const mockedAxios = vi.mocked(axiosInstance, true);

describe('Table API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMetadata', () => {
    it('should get fields correctly', async () => {
      const metadataMock = {
        fields: [
          {
            code: 'fullName',
            description: 'Полное имя',
            type: 'string',
            required: true,
            order: 1,
            min: 1,
            max: 255,
          },
          {
            code: 'email',
            description: 'Email',
            type: 'email',
            required: true,
            order: 2,
            max: 320,
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: metadataMock });

      const result = await getMetadata();

      expect(mockedAxios.get).toHaveBeenCalledWith(GET_METADATA);
      expect(result).toStrictEqual(metadataMock);
    });

    it('should throw an error when the request fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error'));

      await expect(getMetadata()).rejects.toThrow('Error');
    });
  });

  describe('getRecords', () => {
    it('should retrieves records by page', async () => {
      const page = 1;
      const recordsMock = {
        first: 1,
        prev: null,
        next: 2,
        last: 2,
        pages: 2,
        items: 20,
        data: [
          {
            id: '1',
            fullName: 'Иван Иванов',
            email: 'ivan.ivanov@example.com',
            age: 30,
            city: 'Москва',
            isActive: true,
            phoneNumber: '+79261234567',
          },
          {
            id: '2',
            fullName: 'Анна Смирнова',
            email: 'anna.smirnova@example.com',
            age: 27,
            city: 'Санкт-Петербург',
            isActive: false,
            phoneNumber: '+79161234567',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: recordsMock });

      const result = await getRecords(page);

      expect(mockedAxios.get).toHaveBeenCalledWith(GET_RECORDS(page));
      expect(result).toStrictEqual(recordsMock);
    });

    it('should throw an error when the request fails', async () => {
      const page = 1;

      mockedAxios.get.mockRejectedValueOnce(new Error('Ошибка'));

      await expect(getRecords(page)).rejects.toThrow('Ошибка');
    });
  });

  describe('createRecord', () => {
    it('should successfully creates a new record', async () => {
      const newRecord = {
        fullName: 'Иван Иванов',
        email: 'ivan.ivanov@example.com',
        age: 30,
        city: 'Москва',
        isActive: true,
        phoneNumber: '+79261234567',
      };
      const createdRecordMock = { id: '1', ...newRecord };

      mockedAxios.post.mockResolvedValueOnce({ data: createdRecordMock });

      const result = await createRecord(newRecord);

      expect(mockedAxios.post).toHaveBeenCalledWith(CREATE_RECORD, newRecord);
      expect(result).toStrictEqual(createdRecordMock);
    });

    it('should throw an error when the request fails', async () => {
      const newRecord = {
        fullName: 'Иван Иванов',
        email: 'ivan.ivanov@example.com',
        age: 30,
        city: 'Москва',
        isActive: true,
        phoneNumber: '+79261234567',
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Ошибка'));

      await expect(createRecord(newRecord)).rejects.toThrow('Ошибка');
    });
  });
});
