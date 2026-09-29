import { DateTime } from '@potentiel-domain/common';
import type { Candidature } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import type { DossierAccessor } from '../../graphql/index.js';

type GetAutorisationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampDate: keyof TDossier;
  nomChampNuméro: keyof TDossier;
};
export const getAutorisation = <TDossier extends Record<string, string>>({
  accessor,
  nomChampDate,
  nomChampNuméro,
}: GetAutorisationProps<TDossier>): Candidature.Dépôt.RawType['autorisation'] => {
  const logger = getLogger('dn-api-client');
  const numéro = accessor.getStringValue(nomChampNuméro);
  let date = accessor.getDateValue(nomChampDate);

  if (numéro && date) {
    if (DateTime.convertirEnValueType(date).estDansLeFutur()) {
      /** hack temporaire pour ne pas bloquer l'import de la P2 Petit PV,
       * on force les dates futures à la date du jour,
       * projets à corriger en SAV */
      logger.warn(
        `la date de l'autorisation ${numéro} est dans le futur, nous appliquons la date du jour par défaut`,
      );
      date = DateTime.now().formatter();
    }
    return {
      numéro,
      date,
    };
  }
};
