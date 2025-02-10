import { CurrencyResultWrapper, ExchangeResult, StyledAmount, DecimalPart, CurrencyCode } from  '../../design-system';

interface ExchangeResultProps {
  integerPart: string;
  decimalPart: string;
  currencyCode?: string;
}

export function ExchangeResultDisplay({ integerPart, decimalPart, currencyCode }: ExchangeResultProps) {
  return (
    <CurrencyResultWrapper>
      <ExchangeResult>
        <StyledAmount>{integerPart}</StyledAmount>
        <DecimalPart>.{decimalPart}</DecimalPart>
        <CurrencyCode>{currencyCode}</CurrencyCode>
      </ExchangeResult>
    </CurrencyResultWrapper>
  );
}
