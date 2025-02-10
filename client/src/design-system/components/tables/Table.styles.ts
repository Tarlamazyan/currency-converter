import styled from 'styled-components';
import { palette, fontSizes } from '../../styles';

export const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  position: relative;
  border: 2px solid ${palette['gray-400']};
`;

export const TableWrapper = styled.div`
  width: 100%;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: ${fontSizes.base};
  text-align: left;
  min-width: 600px;
`;

export const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background-color: ${palette['gray-200']};
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  will-change: transform;
`;

export const StyledTh = styled.th<{ $isSortable?: boolean }>`
  padding: 12px;
  border: 1px solid ${palette['gray-300']};
  font-weight: 600;
  ${({ $isSortable }) => $isSortable && 'cursor: pointer;'}
`;

export const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid ${palette['gray-300']};
`;

export const StyledTr = styled.tr`
  &:nth-child(even) {
    background-color: ${palette['gray-100']};
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 16px;
    border: 1px solid ${palette['gray-400']};
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${palette.danger};
`;

export const SortIcon = styled.span`
  margin-left: 8px;
`;
