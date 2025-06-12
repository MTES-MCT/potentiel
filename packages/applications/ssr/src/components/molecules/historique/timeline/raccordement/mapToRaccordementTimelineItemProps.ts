import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Raccordement } from '@potentiel-domain/laureat';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import {
  dossierRaccordement,
  gestionnaireRéseau,
  mapToRacordementSuppriméTimelineItemProps,
} from './events';

export type RaccordementHistoryRecord = HistoryRecord<
  'raccordement',
  Raccordement.RaccordementEvent['type'],
  Raccordement.RaccordementEvent['payload']
>;

export const mapToRaccordementTimelineItemProps = (record: RaccordementHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
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
      dossierRaccordement.mapToDossierRacordementSuppriméTimelineItemProps,
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
      mapToRacordementSuppriméTimelineItemProps,
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
