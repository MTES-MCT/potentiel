import test, { describe } from 'node:test';

import { expect, assert } from 'chai';

import { candidatureSchema } from './candidature.schema';

const minimumValues = {
  identifiantProjet: 'PPE2 Bâtiment#1#2#3',
  nomProjet: 'Nom du projet',
  societeMere: 'Société Mère',
  nomCandidat: 'Candidat',
  puissanceProductionAnnuelle: '100',
  prixReference: '50',
  noteTotale: '80',
  nomRepresentantLegal: 'Représentant Légal',
  emailContact: 'contact@example.com',
  adresse1: 'Adresse 1',
  adresse2: 'Adresse 2',
  codePostal: '75001',
  commune: 'Paris',
  departement: 'Département',
  region: 'Région',
  statut: 'classé',
  puissanceALaPointe: 'true',
  evaluationCarboneSimplifiee: '10',
  technologie: 'eolien',
  typeGarantiesFinancieres: 'avec-date-échéance',
  dateEcheanceGf: '01/01/2025',
};

describe('candidatureSchema', () => {
  test('Cas nominal, classé', () => {
    const result = candidatureSchema.safeParse(minimumValues);
    assert(result.success);
    expect(result.data).to.deep.equal({
      ...minimumValues,
      puissanceProductionAnnuelle: 100,
      prixReference: 50,
      noteTotale: 80,
      puissanceALaPointe: true,
      evaluationCarboneSimplifiee: 10,
      dateEcheanceGf: new Date(minimumValues.dateEcheanceGf),
    });
  });

  test('Cas nominal, éliminé', () => {
    const result = candidatureSchema.safeParse({
      ...minimumValues,
      statut: 'éliminé',
      motifElimination: 'Motif',
    });
    assert(result.success);
    expect(result.data).to.deep.equal({
      ...minimumValues,
      statut: 'éliminé',
      puissanceProductionAnnuelle: 100,
      prixReference: 50,
      noteTotale: 80,
      puissanceALaPointe: true,
      evaluationCarboneSimplifiee: 10,
      motifElimination: 'Motif',
      dateEcheanceGf: new Date(minimumValues.dateEcheanceGf),
    });
  });

  test("motifs d'élimination requis si candidature éliminée", () => {
    const result = candidatureSchema.safeParse({
      ...minimumValues,
      statut: 'éliminé',
      motifElimination: undefined,
    });
    assert(!result.success);
    expect(result.error.errors[0]).to.deep.equal({
      code: 'invalid_type',
      expected: 'string',
      received: 'undefined',
      path: ['motifElimination'],
      message: '"motifElimination" est requis lorsque "statut" a la valeur "éliminé"',
    });
  });

  test('typeGarantiesFinancieres est requis si la candidature est classée', () => {
    const result = candidatureSchema.safeParse({
      ...minimumValues,
      statut: 'classé',
      typeGarantiesFinancieres: undefined,
    });
    assert(!result.success);
    expect(result.error.errors[0]).to.deep.equal({
      code: 'invalid_type',
      expected: 'string',
      received: 'undefined',
      path: ['typeGarantiesFinancieres'],
      message: '"typeGarantiesFinancieres" est requis lorsque "statut" a la valeur "classé"',
    });
  });

  test("date d'échéance est requis si typeGarantiesFinancieres est avec date d'échéance", () => {
    const result = candidatureSchema.safeParse({
      ...minimumValues,
      statut: 'classé',
      typeGarantiesFinancieres: 'avec-date-échéance',
      dateEcheanceGf: undefined,
    });
    assert(!result.success);
    expect(result.error.errors[0]).to.deep.equal({
      code: 'invalid_type',
      expected: 'string',
      received: 'undefined',
      path: ['dateEcheanceGf'],
      message:
        '"dateEcheanceGf" est requis lorsque "typeGarantiesFinancieres" a la valeur "avec-date-échéance"',
    });
  });
});
