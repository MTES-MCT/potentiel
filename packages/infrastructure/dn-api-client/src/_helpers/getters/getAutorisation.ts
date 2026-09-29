import { DateTime } from '@potentiel-domain/common';
import type { Candidature } from '@potentiel-domain/projet';

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
  const numéro = accessor.getStringValue(nomChampNuméro);
  const date = accessor.getDateValue(nomChampDate);

  if (numéro && date) {
    return {
      numéro,
      /** hack temporaire pour ne pas bloquer l'import de la P2 Petit PV,
       * on force les dates futures à la date du jour,
       * projets à corriger en SAV */
      date: DateTime.convertirEnValueType(date).estDansLeFutur()
        ? DateTime.now().formatter()
        : date,
    };
  }
};
