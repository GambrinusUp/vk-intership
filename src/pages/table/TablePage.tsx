import { Flex, Loader, Title } from "@mantine/core";
import { useEffect } from "react";

import { getMetadata } from "~/features/table/model";
import { TableRecords } from "~/features/table/ui/TableRecords";
import { useNotification } from "~/shared/hooks";
import { LoadingState } from "~/shared/types";
import { useAppDispatch, useAppSelector } from "~/store";

export const TablePage = () => {
  const dispatch = useAppDispatch();
  const { showError } = useNotification();
  const { fieldsLoadingState, error } = useAppSelector((state) => state.table);

  const isLoading = fieldsLoadingState === LoadingState.PENDING;

  useEffect(() => {
    if (fieldsLoadingState === LoadingState.IDLE) {
      dispatch(getMetadata());
    }
  }, [dispatch, fieldsLoadingState]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <Flex w="100%" h="100%" align="center" p="lg" direction="column" gap="md">
      <Title order={1}>Таблица</Title>
      {isLoading ? <Loader size="xl" /> : <TableRecords />}
    </Flex>
  );
};
