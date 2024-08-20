export const formatDateForPdf = (date: Date | number | undefined): string => {
  if (!date) {
    return '';
  }
  return new Intl.DateTimeFormat('fr', { dateStyle: 'long' }).format(Date.now());
};
