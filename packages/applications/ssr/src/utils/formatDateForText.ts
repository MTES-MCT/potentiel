import { format } from 'date-fns';

export const formatDateForText = (date: string) => format(new Date(date), 'dd/MM/yyyy');
