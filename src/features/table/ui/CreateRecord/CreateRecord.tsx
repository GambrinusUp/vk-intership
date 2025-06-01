import {
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { Save } from 'lucide-react';
import { useState } from 'react';

import {
  createRecord,
  type CreateRecordPayload,
  FieldTypes,
} from '~/features/table/model';
import { useNotification } from '~/shared/hooks';
import { useAppDispatch, useAppSelector } from '~/store';

import { useFormTable } from './CreateRecord.hooks';
import type { CreateRecordProps } from './CreateRecord.types';

export const CreateRecord = ({ opened, onClose }: CreateRecordProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { fields } = useAppSelector((state) => state.table);
  const { form, initialValues } = useFormTable(fields);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    form.validate();

    if (form.isValid()) {
      setIsLoading(true);
      const formData = form.getValues();

      const result = await dispatch(
        createRecord(formData as CreateRecordPayload),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Запись успешно создана');
        form.setValues({ ...initialValues });
        setIsLoading(false);
        onClose();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Создание записи'
      centered
      radius='md'
      p='md'
    >
      <Stack>
        {fields.map((field) => {
          switch (field.type) {
            case FieldTypes.STRING:
            case FieldTypes.EMAIL:
              return (
                <TextInput
                  label={field.description}
                  withAsterisk={field.required}
                  disabled={isLoading}
                  key={field.code}
                  {...form.getInputProps(field.code)}
                />
              );
            case FieldTypes.NUMBER:
              return (
                <NumberInput
                  label={field.description}
                  withAsterisk={field.required}
                  disabled={isLoading}
                  key={field.code}
                  {...form.getInputProps(field.code)}
                />
              );
            case FieldTypes.BOOLEAN:
              return (
                <Checkbox
                  disabled={isLoading}
                  label={field.description}
                  key={field.code}
                  {...form.getInputProps(field.code, { type: 'checkbox' })}
                />
              );
            default:
              return null;
          }
        })}
        <Button
          variant='light'
          leftSection={<Save />}
          loading={isLoading}
          loaderProps={{ type: 'dots' }}
          onClick={handleSubmit}
        >
          Сохранить
        </Button>
      </Stack>
    </Modal>
  );
};
