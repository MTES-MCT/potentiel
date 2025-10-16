import { withFilters } from '../_helpers/withFilters';

type ListerFilters = {
  appelOffre?: string;
  statut?: 'notifiee' | 'a-notifier';
};

export const lister = withFilters<ListerFilters>(`/periodes`);
