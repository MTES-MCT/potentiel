import { withFilters } from '../_helpers/withFilters.js';

export const lister = withFilters<{
  appelOffre?: string;
  statut?: 'notifiee' | 'a-notifier';
}>(`/periodes`);
