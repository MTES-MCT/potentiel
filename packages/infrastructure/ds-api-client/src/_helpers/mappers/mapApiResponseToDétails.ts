import { getLogger } from '@potentiel-libraries/monitoring';

import { GetDossierQuery } from '../../graphql/index.js';

type MapApiResponseToDétails = {
  champs: GetDossierQuery['dossier']['champs'];
};

export const mapApiResponseToDétails = ({ champs }: MapApiResponseToDétails) => {
  const logger = getLogger('ds-api-client');
  return champs.reduce(
    (prev, curr) => {
      if (prev[curr.label]) {
        logger.warn(`le champs ${curr.label} existe déjà`);
        return prev;
      }
      if (curr.__typename === 'DateChamp') {
        prev[curr.label] = curr.date;
        return prev;
      }
      if (!curr.stringValue) return prev;
      if (curr.label.startsWith('En cochant cette case')) return prev;
      prev[curr.label] = curr.stringValue ?? undefined;
      return prev;
    },
    {} as Record<string, unknown>,
  );
};
