import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

EtantDonné(`la candidature {string}`, async function (this: PotentielWorld, nomProjet: string) {
  const appelOffre = 'PPE2 - Eolien';
  const période = '1';
  const famille = '';
  const numéroCRE = '23';
  const statut = 'classé';

  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: {
      appelOffreValue: appelOffre,
      périodeValue: période,
      familleValue: famille,
      numéroCREValue: numéroCRE,
      statutValue: statut,
      nomProjetValue: nomProjet,
      nomCandidatValue: 'Candidat',
      emailContactValue: 'porteur@test.test',
      codePostalValue: '13000',
      communeValue: 'MARSEILLE',
      adresse1Value: '5 avenue laeticia',
      adresse2Value: '',
      motifÉliminationValue: (statut as StatutProjet.RawType) === 'classé' ? 'Motif' : '',
      puissanceALaPointeValue: false,
      sociétéMèreValue: '',
      technologieValue: 'N/A',
      territoireProjetValue: '',
      dateÉchéanceGfValue: '',
      historiqueAbandonValue: Candidature.HistoriqueAbandon.types[3],
      puissanceProductionAnnuelleValue: 1,
      prixReferenceValue: 1,
      noteTotaleValue: 1,
      nomReprésentantLégalValue: '',
      evaluationCarboneSimplifiéeValue: 1,
      financementCollectifValue: false,
      gouvernancePartagéeValue: false,
      typeGarantiesFinancièresValue: 'consignation',
      financementParticipatifValue: false,
      détailsValue: {},
    },
  });

  this.candidatureWorld.candidatureFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
  });
});
