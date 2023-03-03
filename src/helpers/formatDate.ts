import { format } from 'date-fns';

const formatDate = (timestamp: number | Date, dateFormat?: string) =>
  format(timestamp, dateFormat || 'dd/MM/yyyy');

export { formatDate };
