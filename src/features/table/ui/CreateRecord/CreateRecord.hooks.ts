import { isEmail, useForm } from '@mantine/form';

import { type Field, FieldTypes } from '~/features/table/model';

export const useFormTable = (fields: Field[]) => {
  const initialValues = fields.reduce(
    (acc, field) => {
      acc[field.code] = field.type === FieldTypes.BOOLEAN ? false : '';
      return acc;
    },
    {} as Record<string, unknown>,
  );

  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: (values: Record<string, unknown>) => {
      const errors: Partial<Record<string, string>> = {};

      fields.forEach((field) => {
        const value = values[field.code];

        if (
          field.required &&
          (value === '' || value === null || value === undefined)
        ) {
          errors[field.code] = 'Поле обязательно';
          return;
        }

        if (field.type === FieldTypes.EMAIL) {
          const error = isEmail('Невалидный email')(value);
          if (typeof error === 'string') {
            errors[field.code] = error;
          }
        }

        if (field.type === FieldTypes.STRING) {
          const val = String(value ?? '');
          const min = field.min ?? 1;
          const max = field.max;

          if (val.length < min) {
            errors[field.code] = `Минимальная длина — ${min}`;
          } else if (max && val.length > max) {
            errors[field.code] = `Максимальная длина — ${max}`;
          }
        }

        if (field.type === FieldTypes.NUMBER) {
          const num = Number(value);

          const min = field.min ?? -Infinity;
          const max = field.max ?? Infinity;

          if (num < min) {
            errors[field.code] = `Минимальное значение — ${min}`;
          } else if (num > max) {
            errors[field.code] = `Максимальное значение — ${max}`;
          }
        }
      });

      return errors;
    },
  });

  return { form, initialValues };
};
