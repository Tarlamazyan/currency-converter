import React from 'react';
import { StyledTd } from '../Table.styles.ts';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
}

export const CellTable = <T,>({ column, value }: { column: Column<T>; value: T[keyof T] }) => {
  return (
    <StyledTd data-label={column.header}>
      {column.render ? column.render(value) : String(value)}
    </StyledTd>
  );
};
