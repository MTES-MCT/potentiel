export const formatDateToText = (date: string) => Intl.DateTimeFormat('fr').format(new Date(date));
