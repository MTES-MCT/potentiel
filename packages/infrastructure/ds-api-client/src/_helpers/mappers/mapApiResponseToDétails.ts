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
        logger.warn(`le champ ${curr.label} existe déjà`);
        return prev;
      }
      if (curr.__typename === 'DateChamp') {
        prev[curr.label] = curr.date;
        return prev;
      }
      if (curr.__typename === 'RepetitionChamp') {
        curr.rows.forEach((row, index) => {
          row.champs.forEach((champ) => {
            const label = `${champ.label} - ${index + 1}`;
            if (prev[label]) {
              logger.warn(`le champ ${label} existe déjà`);
              return;
            }
            if (champ.__typename === 'DateChamp') {
              prev[label] = champ.date;
              return;
            }
            if (champ.stringValue) {
              prev[label] = champ.stringValue;
            }
          });
        });
      }
      if (!curr.stringValue) return prev;
      if (curr.label.startsWith('En cochant cette case')) return prev;
      prev[curr.label] = curr.stringValue ?? undefined;
      return prev;
    },
    {} as Record<string, string>,
  );
};
