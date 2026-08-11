import { withFilters } from '../_helpers/withFilters.js';

export const lister = withFilters<{
  appelOffre?: string;
  statut?: 'notifiee' | 'a-notifier';
}>(`/periodes`);

export const exporterSynthèsePériode = withFilters<{
  appelOffre: string;
  periode: string;
  type: 'laureat' | 'candidature';
}>(`/periodes/telecharger-synthese-periode`);
