import { useQuery } from '@tanstack/react-query';
import { fetchPrice } from '../services/api';

export function usePrice(tokenIdOrSymbol: string = 'bitcoin') {
  const query = useQuery({
    queryKey: ['usd-price', tokenIdOrSymbol],
    queryFn: () => fetchPrice(tokenIdOrSymbol),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
    retry: false, // Don't auto-retry on error
  });
  return {
    ...query,
    usdPrice: query.data,
    errorObj: query.error,
  };
} 