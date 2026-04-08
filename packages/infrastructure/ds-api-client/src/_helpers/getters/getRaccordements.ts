import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs } from '../../graphql/index.js';

import { findRepetitionChamp } from './utils.js';

export const getRaccordements = (champs: Champs) => {
  const références: Candidature.Dépôt.RawType['raccordements'] = [];

  const raccordements = findRepetitionChamp(
    champs,
    ' Pour chaque référence de raccordement, ajouter un bloc contenant les informations correspondantes',
  );

  if (!raccordements?.rows) return;

  for (const raccordement of raccordements.rows) {
    const raccordementObject = Object.fromEntries(
      raccordement.champs.map((champ) => [champ.label, champ.stringValue]),
    );

    const référence = raccordementObject['Référence du dossier de raccordement'];
    const dateDeLAccuséRéception =
      raccordementObject[`Date de l'accusé de réception de la demande de raccordement`];

    if (référence && dateDeLAccuséRéception) {
      références.push({
        référence: référence.trim(),
        dateQualification: DateTime.convertirEnValueType(
          parse(dateDeLAccuséRéception, 'dd MMMM yyyy', new Date(), { locale: fr }),
        ).formatter(),
      });
    }
  }

  return références;
};
