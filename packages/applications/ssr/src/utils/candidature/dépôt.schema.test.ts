import { describe, test } from 'node:test';

import '../../utils/zod/setupLocale';

import { assert } from 'chai';

import { dépôtSchema } from './dépôt.schema';
import { deepEqualWithRichDiff } from './csv/_test-shared';

const minimumValues = {
  nomProjet: 'Nom du projet',
  sociétéMère: 'Société Mère',
  nomCandidat: 'le candidat',
  puissance: '100',
  prixReference: '5',
  emailContact: 'porteur@test.test',
  nomReprésentantLégal: 'représentant légal',
  localité: {
    adresse1: 'adresse1',
    adresse2: 'adresse2',
    codePostal: '75001',
    commune: 'Paris',
    département: '75',
    région: 'Île-de-France',
  },
  puissanceALaPointe: 'true',
  evaluationCarboneSimplifiée: '100',
  actionnariat: 'gouvernance-partagée',
  historiqueAbandon: 'première-candidature',
  technologie: 'eolien',
  typeGarantiesFinancières: 'avec-date-échéance',
  dateÉchéanceGf: '01/01/2025',
  dateConstitutionGf: '01/01/2024',
  typologieInstallation: [],
};

const expectedMinimumValues = {
  ...minimumValues,
  puissance: 100,
  prixReference: 5,
  puissanceALaPointe: true,
  evaluationCarboneSimplifiée: 100,
  dateÉchéanceGf: new Date(minimumValues.dateÉchéanceGf).toISOString(),
  dateConstitutionGf: new Date(minimumValues.dateConstitutionGf).toISOString(),
};

describe('Schéma dépôt', () => {
  test('cas nominal', () => {
    const result = dépôtSchema.safeParse(minimumValues);

    assert(result.success);
    deepEqualWithRichDiff(result.data, expectedMinimumValues);
  });

  test('champs supplémentaires', () => {
    const champsSupplémentaires = {
      installateur: 'Installateur.Inc',
      coefficientKChoisi: 'true',
      autorisationDUrbanisme: { numéro: 'URB-01', date: '12/12/2022' },
      puissanceDeSite: '200',
      natureDeLExploitation: { typeNatureDeLExploitation: 'vente-avec-injection-en-totalité' },
      puissanceProjetInitial: '100',
    };

    const result = dépôtSchema.safeParse({
      ...minimumValues,
      ...champsSupplémentaires,
    });

    assert(result.success);
    deepEqualWithRichDiff(result.data, {
      ...expectedMinimumValues,
      ...champsSupplémentaires,
      coefficientKChoisi: true,
      puissanceDeSite: 200,
      puissanceProjetInitial: 100,
      autorisationDUrbanisme: {
        numéro: 'URB-01',
        date: new Date(champsSupplémentaires.autorisationDUrbanisme.date).toISOString(),
      },
    });
  });
});
