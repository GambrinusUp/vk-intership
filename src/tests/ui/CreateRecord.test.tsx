import '@testing-library/jest-dom';

import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { tableReducer } from '~/features/table';
import { FieldTypes } from '~/features/table/model';
import * as tableActions from '~/features/table/model/table.actions';
import { CreateRecord } from '~/features/table/ui/CreateRecord';
import { useNotification } from '~/shared/hooks';
import { LoadingState } from '~/shared/types';

vi.mock('~/shared/hooks/useNotification');

describe('CreateRecord', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();
  const mockShowSuccess = vi.fn();
  const createRecordSpy = vi.spyOn(tableActions, 'createRecord');

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
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNotification).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
    });
  });

  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        table: tableReducer,
      },
      preloadedState: {
        table: {
          fieldsLoadingState: LoadingState.FULFILLED,
          recordLoadingState: LoadingState.IDLE,
          fields: [
            {
              code: 'fullName',
              description: 'ФИО',
              type: FieldTypes.STRING,
              required: true,
              order: 1,
            },
            {
              code: 'email',
              description: 'Email',
              type: FieldTypes.EMAIL,
              required: true,
              order: 2,
            },
            {
              code: 'age',
              description: 'Возраст',
              type: FieldTypes.NUMBER,
              required: false,
              order: 3,
            },
            {
              code: 'isActive',
              description: 'Активен',
              type: FieldTypes.BOOLEAN,
              required: false,
              order: 4,
            },
          ],
          records: [],
          prevPage: null,
          nextPage: 1,
          error: undefined,
        },
      },
    });

    vi.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    return render(
      <MantineProvider>
        <Provider store={store}>
          <CreateRecord opened={true} onClose={mockOnClose} />
        </Provider>
      </MantineProvider>,
    );
  };

  it('renders all fields based on metadata', () => {
    renderComponent();

    expect(screen.getByLabelText(/ФИО/i, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Email/i, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Возраст/i, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Активен/i, { exact: false }),
    ).toBeInTheDocument();
  });

  it('shows validation errors if required fields are empty', async () => {
    renderComponent();

    const saveButton = screen.getByRole('button', { name: /сохранить/i });
    await userEvent.click(saveButton);

    expect(await screen.findAllByText('Поле обязательно')).toHaveLength(2);
  });

  it('dispatches createRecord and closes modal on success', async () => {
    mockDispatch.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: { id: 1 },
    });

    renderComponent();

    await userEvent.type(
      screen.getByLabelText(/ФИО/i, { exact: false }),
      'Иван Иванов',
    );
    await userEvent.type(
      screen.getByLabelText(/Email/i, { exact: false }),
      'test@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Возраст/i, { exact: false }),
      '25',
    );

    const saveButton = screen.getByRole('button', { name: /сохранить/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(createRecordSpy).toHaveBeenCalled();
      expect(createRecordSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Иван Иванов',
          email: 'test@example.com',
          age: 25,
        }),
      );

      expect(mockShowSuccess).toHaveBeenCalledWith('Запись успешно создана');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
