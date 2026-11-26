export const formatDateForEmail = (date: Date | undefined): string => {
  if (!date) {
    return '';
  }
  return new Intl.DateTimeFormat('fr').format(date);
};
