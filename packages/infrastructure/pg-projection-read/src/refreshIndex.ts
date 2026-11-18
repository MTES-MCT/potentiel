import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const refreshOneIndex = async (identifiantProjet: string) => {
  await executeQuery('call domain_views.refresh_search_projects($1)', identifiantProjet);
};

export const refreshAllIndex = async () => {
  await executeQuery('call domain_views.refresh_search_projects()');
};
