import { useCallback } from 'react';
import { StyledTh, SortIcon } from '../Table.styles.ts';

interface Column<T> {
  key: keyof T;
  header: string;
}

interface TableHeaderProps<T> {
  column: Column<T>;
  onSort?: (columnKey: keyof T) => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export const HeaderTable = <T,>({ column, onSort, sortColumn, sortDirection }: TableHeaderProps<T>) => {
  const handleSort = useCallback(() => {
    onSort?.(column.key);
  }, [onSort, column.key]);

  const isCurrentSortColumn = column.key === sortColumn;

  return (
    <StyledTh
      scope="col"
      $isSortable={!!onSort}
      onClick={handleSort}
      onKeyDown={(e) => e.key === 'Enter' && handleSort()}
      tabIndex={onSort ? 0 : undefined}
      aria-label={`Sort by ${column.header} (${sortDirection || 'none'})`}
      aria-sort={isCurrentSortColumn ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {column.header}
      {onSort && <SortIcon className={isCurrentSortColumn ? sortDirection : ''} aria-hidden="true" />}
    </StyledTh>
  );
};
