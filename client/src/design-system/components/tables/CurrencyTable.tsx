import React, { useState } from 'react';
import { TableWrapper, StyledTable, StyledTr, TableContainer, TableHead } from './Table.styles';
import { HeaderTable, CellTable, StateTable } from './components';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
}

interface CurrencyTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns?: Column<T>[];
  title?: string;
  summary?: string;
  isLoading?: boolean;
  error?: Error;
  onSort?: (columnKey: keyof T) => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export const CurrencyTable = <T extends Record<string, unknown>>({
  data,
  columns,
  title,
  summary,
  isLoading,
  error

}: CurrencyTableProps<T>) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortColumnState, setSortColumn] = useState<keyof T | undefined>(undefined);
  const [sortDirectionState, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const tableColumns = columns || (data.length > 0 ? Object.keys(data[0]).map(key => ({ key, header: key })) : []);

  const handleSort = (columnKey: keyof T) => {
    const newDirection = sortColumnState === columnKey && sortDirectionState === 'asc' ? 'desc' : 'asc';

    const sorted = [...sortedData].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return newDirection === 'asc' ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setSortColumn(columnKey);
    setSortDirection(newDirection);
  };

  return (
    <TableContainer>
      <StateTable isLoading={isLoading ?? false} error={error} hasData={data.length > 0} />
      <TableWrapper role="region" aria-labelledby={title ? 'table-title' : undefined} tabIndex={0}>
        <StyledTable summary={summary} aria-labelledby={title ? 'table-title' : undefined} aria-describedby="table-description">
          {title && <caption id="table-title">{title}</caption>}
          <TableHead aria-label="Table Head">
            <StyledTr>
              {tableColumns.map(column => (
                <HeaderTable
                  key={column.key as string}
                  column={column}
                  onSort={() => handleSort(column.key)}
                  sortColumn={sortColumnState}
                  sortDirection={sortDirectionState}
                />
              ))}
            </StyledTr>
          </TableHead>
          <tbody>
          {sortedData.map((item, rowIndex) => (
            <StyledTr key={rowIndex}>
              {tableColumns.map(column => (
                <CellTable key={column.key as string} column={column} value={item[column.key]} />
              ))}
            </StyledTr>
          ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  );
};
