import { ProjetReadModel } from '../../domainViews.readModel';

export type ListerDépôtsGarantiesFinancièresEnAttentePort = (args: {
  région: string;
  pagination: { page: number; itemsPerPage: number };
}) => Promise<{
  items: {
    dateLimiteDépôt?: string;
    projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire' | 'statut'>;
  }[];
  totalCount: number;
}>;
