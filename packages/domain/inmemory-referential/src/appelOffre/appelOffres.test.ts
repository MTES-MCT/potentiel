import { test } from 'node:test';

import { appelsOffreData } from './index.js';

test(`Valeurs d'instruction de représentant légal`, (t) => {
  const actual = appelsOffreData.map((appelOffre) => {
    return appelOffre.periodes.map((periode) => {
      const changement = periode.miseÀJour?.changement ?? appelOffre.miseÀJour.changement;

      return {
        appelOffre: appelOffre.id,
        période: periode.id,
        initial:
          changement === 'indisponible'
            ? 'indisponible'
            : changement?.représentantLégal?.informationEnregistrée
              ? 'information-enregistrée'
              : (changement?.représentantLégal?.instructionAutomatique ?? '__MANQUANT__'),

        ...periode.cahiersDesChargesModifiésDisponibles.reduce(
          (acc, { miseÀJour, paruLe, alternatif }) => {
            acc[paruLe + (alternatif ? '-alternatif' : '')] = miseÀJour?.changement
              ?.représentantLégal?.informationEnregistrée
              ? 'information-enregistrée'
              : (miseÀJour?.changement?.représentantLégal?.instructionAutomatique ??
                '__MANQUANT__');
            return acc;
          },
          {} as Record<string, 'information-enregistrée' | 'accord' | 'rejet' | '__MANQUANT__'>,
        ),
      };
    });
  });

  t.assert.snapshot(actual.flat());
});
