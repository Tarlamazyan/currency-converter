import React from 'react';
import { LoadingState, ErrorState } from '../Table.styles.ts';

export const StateTable: React.FC<{ isLoading: boolean; error?: Error; hasData: boolean }> = ({ isLoading, error, hasData }) => {
  if (isLoading) return <LoadingState>Loading data...</LoadingState>;
  if (error) return <ErrorState>Error: {error.message}</ErrorState>;
  if (!hasData) return <ErrorState>No data available</ErrorState>;
  return null;
};
