import '@testing-library/jest-dom';

import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { TableRecords, tableReducer } from '~/features/table';
import { FieldTypes } from '~/features/table/model';
import * as tableActions from '~/features/table/model/table.actions';
import { LoadingState } from '~/shared/types';

describe('TableRecords', () => {
  const mockDispatch = vi.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    })) as unknown as typeof IntersectionObserver;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    preloadedState: Partial<ReturnType<typeof tableReducer>>,
  ) => {
    const store = configureStore({
      reducer: {
        table: tableReducer,
      },
      preloadedState: {
        table: {
          fields: [],
          records: [],
          fieldsLoadingState: LoadingState.IDLE,
          recordLoadingState: LoadingState.IDLE,
          prevPage: null,
          nextPage: null,
          error: undefined,
          ...preloadedState,
        },
      },
    });

    vi.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    return render(
      <MantineProvider>
        <Provider store={store}>
          <TableRecords />
        </Provider>
      </MantineProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no records are available', () => {
    renderComponent({ records: [] });

    expect(screen.getByText(/Записей не найдено/i)).toBeInTheDocument();
  });

  it('renders table with records and fields', () => {
    renderComponent({
      fields: [
        {
          code: 'fullName',
          description: 'ФИО',
          order: 1,
          type: FieldTypes.STRING,
          required: true,
        },
        {
          code: 'email',
          description: 'Email',
          order: 2,
          type: FieldTypes.EMAIL,
          required: true,
        },
      ],
      records: [
        { id: '1', fullName: 'Иван Иванов', email: 'ivan@test.com' },
        { id: '2', fullName: 'Мария Смирнова', email: 'maria@test.com' },
      ],
    });

    expect(screen.getByText('ФИО')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('Мария Смирнова')).toBeInTheDocument();
    expect(screen.getByText('ivan@test.com')).toBeInTheDocument();
    expect(screen.getByText('maria@test.com')).toBeInTheDocument();
  });

  it('dispatches getRecords on mount if page is available', () => {
    const getRecordsSpy = vi.spyOn(tableActions, 'getRecords');

    renderComponent({
      nextPage: 2,
      records: [],
    });

    expect(getRecordsSpy).toHaveBeenCalledWith({ page: 2 });
  });

  it('renders loader when loading', () => {
    renderComponent({
      recordLoadingState: LoadingState.PENDING,
      records: [{ id: '1', fullName: 'Test', email: 'test@example.com' }],
      fields: [
        {
          code: 'fullName',
          description: 'ФИО',
          order: 1,
          type: FieldTypes.STRING,
          required: true,
        },
        {
          code: 'email',
          description: 'Email',
          order: 2,
          type: FieldTypes.EMAIL,
          required: true,
        },
      ],
    });

    expect(document.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('opens modal on create button click', async () => {
    renderComponent({
      fields: [],
      records: [{ id: ' 1' }],
    });

    const button = screen.getByRole('button', { name: /создать запись/i });
    await userEvent.click(button);

    expect(await screen.findByText(/сохранить/i)).toBeInTheDocument();
  });
});
