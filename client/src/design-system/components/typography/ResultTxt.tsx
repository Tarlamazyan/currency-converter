import styled from 'styled-components';
import { palette, fontSizes } from '../../styles';

export const CurrencyResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExchangeResult = styled.h3`
  ${fontSizes.xl};
  font-weight: bold;
  color: ${palette.dark};
`;

export const DecimalPart = styled.span`
  opacity: 0.6;
  ${fontSizes.lg};
  color: ${palette['gray-600']};
`;

export const StyledAmount = styled.span`
  ${fontSizes.xl};
  font-weight: bold;
  color: ${palette.dark};
`;

export const CurrencyCode = styled.span`
  margin-left: 8px;
  ${fontSizes.lg};
  color: ${palette['gray-700']};
`;
