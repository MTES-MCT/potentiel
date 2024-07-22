export const formatDateForEmail = (date: Date | undefined): string => {
  if (!date) {
    return '';
  }
  const isoDate = date.toISOString().split('T')[0];
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};
