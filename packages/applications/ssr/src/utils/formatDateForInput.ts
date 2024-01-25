import { format } from 'date-fns';

export const formatDateForInput = (date: string) => format(new Date(date), 'yyyy-MM-dd');
