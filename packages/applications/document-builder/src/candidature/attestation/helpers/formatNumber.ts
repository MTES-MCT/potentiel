export const formatNumber = (n: number, precisionOverride?: number) => {
  const precision = precisionOverride || 100;
  return (Math.round(n * precision) / precision).toString().replace('.', ',');
};
