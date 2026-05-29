import { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getDonnéesCorrectes } from './getDonnéesCorrectes.js';

type VérifierDateAchèvementPrévisionnel = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateÀVérifier: DateTime.RawType;
};

export const ECART_JOURS = 1;

export const vérifierDateAchèvementPrévisionnelDansÉcart = async ({
  identifiantProjet,
  dateÀVérifier,
}: VérifierDateAchèvementPrévisionnel) => {
  const { dateCorrecte } = await getDonnéesCorrectes(identifiantProjet);

  const écartJours = DateTime.convertirEnValueType(dateÀVérifier).nombreJoursÉcartAvec(
    DateTime.convertirEnValueType(dateCorrecte),
  );

  return écartJours > ECART_JOURS;
};

export class DateAvecÉcartDeJoursTropImportantError extends Error {
  constructor(identifiantProjet: IdentifiantProjet.RawType) {
    super(
      `Le nombre de jours d'écart est supérieur à ${ECART_JOURS}, donc on skip le projet ${identifiantProjet}`,
    );
  }
}
