import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../constants';

interface GridProps {
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  children: React.ReactNode;
  role?: 'grid' | 'presentation';
  ariaLabel?: string;
}

const generateGridStyles = (columns: GridProps['columns']) => {
  return Object.entries(columns)
    .map(([key, value]: [string, number]): string => {
      if (!value) {
        return '';
      }

      const minWidth = breakpoints[key as keyof typeof breakpoints];

      return minWidth > 0
        ? `@media (min-width: ${minWidth}px) { grid-template-columns: repeat(${value}, 1fr); }`
        : `grid-template-columns: repeat(${value}, 1fr);`;
    }).join('\n');
};

const StyledGrid = styled.div<{ $columns: GridProps['columns'] }>`
  display: grid;
  gap: 16px;
  ${({ $columns }) => generateGridStyles($columns)}
`;

export const Grid: React.FC<GridProps> = ({ columns, children, role = 'presentation', ariaLabel }) => {
  return (
    <StyledGrid $columns={columns} role={role} aria-label={ariaLabel}>
      {children}
    </StyledGrid>
  );
};
