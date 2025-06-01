import { Button, Center, Loader, Paper, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getRecords } from '~/features/table/model';
import { CreateRecord } from '~/features/table/ui/CreateRecord';
import { LoadingState } from '~/shared/types';
import { useAppDispatch, useAppSelector } from '~/store';

export const TableRecords = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const { fields, records, recordLoadingState, nextPage } = useAppSelector(
    (state) => state.table,
  );
  const [page, setPage] = useState(nextPage);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isLoading = recordLoadingState === LoadingState.PENDING;

  const lastRecordElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoading || !nextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPage) {
          setPage(nextPage);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, nextPage],
  );

  useEffect(() => {
    if (page && page > 0) {
      dispatch(getRecords({ page }));
    }
  }, [dispatch, page]);

  if (records.length === 0) {
    return (
      <Paper p='md'>
        <Center h={200}>
          <Text c='dimmed'>Записей не найдено</Text>
        </Center>
      </Paper>
    );
  }

  return (
    <>
      <Button leftSection={<Plus />} onClick={open}>
        Создать запись
      </Button>
      <Table highlightOnHover withTableBorder withColumnBorders mt='md'>
        <Table.Thead>
          <Table.Tr>
            {fields.map((field) => (
              <Table.Th key={field.order}>{field.description}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {records.map((record, index) => (
            <Table.Tr
              key={record.id}
              ref={index === records.length - 1 ? lastRecordElementRef : null}
            >
              {fields.map((field) => (
                <Table.Td
                  key={field.order}
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {String(record[field.code] ?? '-')}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {isLoading && <Loader size='lg' />}
      <CreateRecord onClose={close} opened={opened} />
    </>
  );
};
