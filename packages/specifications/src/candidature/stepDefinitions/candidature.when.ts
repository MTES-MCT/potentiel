import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { InstruireCandidatureUseCase } from '@potentiel-domain/candidature';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  `la candidature {string} est instruite avec:`,
  async function (this: PotentielWorld, nomCandidature: string, table: DataTable) {
    const exemple = table.rowsHash();

    await mediator.send<InstruireCandidatureUseCase>({
      type: 'Candidature.UseCase.InstruireCandidature',
      data: {
        appelOffreValue: exemple["appel d'offre"] ?? 'PPE2 - Eolien',
        périodeValue: exemple['période'] ?? '1',
        familleValue: exemple['famille'],
        numéroCREValue: exemple['numéro CRE'] ?? '23',
        statutValue: exemple['statut'] ?? 'classé',
        nomProjetValue: nomCandidature,

        nomCandidatValue: 'Candidat',
        emailContactValue: 'porteur@test.test',
        codePostalValue: '13000',
        communeValue: 'MARSEILLE',
        adresse1Value: '5 avenue laeticia',
        historiqueAbandonValue: 'lauréat_ao',
        puissanceProductionAnnuelleValue: 1,
        prixReferenceValue: 1,
        noteTotaleValue: 1,
        nomReprésentantLégalValue: '',
        evaluationCarboneSimplifiéeValue: 1,
        financementCollectifValue: false,
        gouvernancePartagéeValue: false,
        typeGarantiesFinancièresValue: 'consignation',
      },
    });
  },
);
