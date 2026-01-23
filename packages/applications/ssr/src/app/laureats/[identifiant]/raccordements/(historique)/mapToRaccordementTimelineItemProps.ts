import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import {
  dossierRaccordement,
  gestionnaireRéseau,
  mapToRaccordementSuppriméTimelineItemProps,
} from './events';

type MapToRaccordementTimelineItemProps = (
  record: Lauréat.Raccordement.HistoriqueRaccordementProjetListItemReadModel,
) => TimelineItemProps;

export const mapToRaccordementTimelineItemProps: MapToRaccordementTimelineItemProps = (record) =>
  match(record)
    /**
     * Dossier raccordement
     */
    .with(
      {
        type: P.union(
          'RéférenceDossierRacordementModifiée-V1',
          'RéférenceDossierRacordementModifiée-V2',
        ),
      },
      dossierRaccordement.mapToRéférenceDossierRacordementModifiéeTimelineItemProps,
    )
    .with(
      {
        type: 'DossierDuRaccordementSupprimé-V1',
      },
      dossierRaccordement.mapToDossierRaccordementSuppriméTimelineItemProps,
    )
    ///////////// DCR
    .with(
      {
        type: P.union(
          'DemandeComplèteDeRaccordementTransmise-V1',
          'DemandeComplèteDeRaccordementTransmise-V2',
          'DemandeComplèteDeRaccordementTransmise-V3',
        ),
      },
      dossierRaccordement.DCR.mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps,
    )
    .with(
      {
        type: P.union(
          'DemandeComplèteRaccordementModifiée-V1',
          'DemandeComplèteRaccordementModifiée-V2',
          'DemandeComplèteRaccordementModifiée-V3',
        ),
      },
      dossierRaccordement.DCR.mapToDemandeComplèteRaccordementModifiéeTimelineItemProps,
    )
    .with(
      { type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1' },
      dossierRaccordement.DCR
        .mapToAccuséRéceptionDemandeComplèteRaccordementTransmisTimelineItemProps,
    )
    ///////////// PTF
    .with(
      {
        type: P.union(
          'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
          'PropositionTechniqueEtFinancièreTransmise-V1',
          'PropositionTechniqueEtFinancièreTransmise-V2',
          'PropositionTechniqueEtFinancièreTransmise-V3',
        ),
      },
      dossierRaccordement.PTF.mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps,
    )
    .with(
      {
        type: P.union(
          'PropositionTechniqueEtFinancièreModifiée-V1',
          'PropositionTechniqueEtFinancièreModifiée-V2',
        ),
      },
      dossierRaccordement.PTF.mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps,
    )
    ///////////// Date de mise en service
    .with(
      {
        type: P.union('DateMiseEnServiceTransmise-V1', 'DateMiseEnServiceTransmise-V2'),
      },
      dossierRaccordement.dateMiseEnService.mapToDateMiseEnServiceTransmiseTimelineItemProps,
    )
    .with(
      { type: 'DateMiseEnServiceSupprimée-V1' },
      dossierRaccordement.dateMiseEnService.mapToDossierRacordementSuppriméTimelineItemProps,
    )

    /***
     * Gestionnaire de réseau
     */
    .with(
      {
        type: 'GestionnaireRéseauAttribué-V1',
      },
      gestionnaireRéseau.mapToGestionnaireRéseauAttribuéTimelineItemProps,
    )
    .with(
      {
        type: 'GestionnaireRéseauRaccordementModifié-V1',
      },
      gestionnaireRéseau.mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps,
    )
    /**
     * Raccordement du projet
     */
    .with(
      {
        type: 'RaccordementSupprimé-V1',
      },
      mapToRaccordementSuppriméTimelineItemProps,
    )
    /**
     * Ignoré
     */
    .with(
      {
        type: 'GestionnaireRéseauInconnuAttribué-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();
