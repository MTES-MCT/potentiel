import { withFilters } from '../_helpers/withFilters.js';

type ListerFilters = {
  appelOffre?: string;
  statut?: 'notifiee' | 'a-notifier';
};

export const lister = withFilters<ListerFilters>(`/periodes`);

export const exporterSynthèsePériode = withFilters<{
  appelOffre: string;
  periode: string;
}>(`/periodes/telecharger-synthese-periode`);
