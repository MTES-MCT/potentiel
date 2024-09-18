export const defaultStatutValueForPériodeList = 'a-notifier';

type ListerFilters = {
  appelOffre?: string;
  statut?: 'notifiee' | typeof defaultStatutValueForPériodeList;
};

export const lister = (filters: ListerFilters) => {
  const searchParams = new URLSearchParams();

  if (filters?.appelOffre) {
    searchParams.set('appelOffre', filters.appelOffre);
  }

  if (filters?.statut) {
    searchParams.set('statut', filters.statut);
  }

  return `/periodes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};
