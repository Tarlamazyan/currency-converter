import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../../constants';

interface GridItemProps {
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  start?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  end?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  children?: React.ReactNode;
}

const generateGridItemStyles = (props: GridItemProps): string => {
  const { span, start, end } = props;

  return Object.entries(breakpoints)
    .map(([key, minWidth]: [string, number]): string => {
      const spanValue = span?.[key as keyof typeof span];
      const startValue = start?.[key as keyof typeof start];
      const endValue = end?.[key as keyof typeof end];

      let styles = '';

      if (spanValue) {
        styles += minWidth > 0
          ? `@media (min-width: ${minWidth}px) { grid-column: span ${spanValue}; }`
          : `grid-column: span ${spanValue};`;
      }

      if (startValue) {
        styles += minWidth > 0
          ? `@media (min-width: ${minWidth}px) { grid-column-start: ${startValue}; }`
          : `grid-column-start: ${startValue};`;
      }

      if (endValue) {
        styles += minWidth > 0
          ? `@media (min-width: ${minWidth}px) { grid-column-end: ${endValue}; }`
          : `grid-column-end: ${endValue};`;
      }

      return styles;
    }).join('\n');
};

const StyledGridItem = styled.div<GridItemProps>`
  ${({ span, start, end }) => generateGridItemStyles({ span, start, end })}
`;

export const GridItem: React.FC<GridItemProps> = ({ span, start, end, children }) => {
  return <StyledGridItem span={span} start={start} end={end}>{children}</StyledGridItem>;
};
