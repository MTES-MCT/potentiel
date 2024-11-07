export const formatDateForDocument = (date: Date | undefined): string =>
  date ? date.toLocaleDateString('fr-FR') : 'JJ/MM/AAAA';
