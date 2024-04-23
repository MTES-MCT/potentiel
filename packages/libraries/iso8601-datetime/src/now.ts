import { Iso8601DateTime } from './Iso8601DateTime';

export const now = () => new Date().toISOString() as Iso8601DateTime;
