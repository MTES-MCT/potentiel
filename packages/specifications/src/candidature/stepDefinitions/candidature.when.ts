import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  `un administrateur importe la candidature {string} avec:`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const appelOffre = exemple["appel d'offre"] ?? 'PPE2 - Eolien';
    const période = exemple['période'] ?? '1';
    const famille = exemple['famille'] ?? '';
    const numéroCRE = exemple['numéro CRE'] ?? '23';
    const statut = exemple['statut'] ?? 'classé';
    const typeGarantiesFinancières = exemple['type GF'] ?? 'consignation';

    try {
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
          typeGarantiesFinancièresValue: typeGarantiesFinancières,
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);
