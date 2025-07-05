// Helper to truncate decimals without rounding
export function truncateDecimals(value: string, maxDecimals: number) {
  if (!value.includes('.')) return value;
  const [intPart, decPart] = value.split('.');
  return decPart.length > maxDecimals
    ? `${intPart}.${decPart.slice(0, maxDecimals)}`
    : value;
} 