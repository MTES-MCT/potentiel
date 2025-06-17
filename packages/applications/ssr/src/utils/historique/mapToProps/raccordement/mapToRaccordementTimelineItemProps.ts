import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Raccordement } from '@potentiel-domain/laureat';
import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { raccordementIcon } from '../icons';

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

export type MapToRaccordementTimelineItemProps = (
  readmodel: Historique.HistoriqueRaccordementProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

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
      (event) =>
        dossierRaccordement.mapToRéférenceDossierRacordementModifiéeTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with(
      {
        type: 'DossierDuRaccordementSupprimé-V1',
      },
      (event) =>
        dossierRaccordement.mapToDossierRacordementSuppriméTimelineItemProps(
          event,
          raccordementIcon,
        ),
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
      (event) =>
        dossierRaccordement.DCR.mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with(
      {
        type: P.union(
          'DemandeComplèteRaccordementModifiée-V1',
          'DemandeComplèteRaccordementModifiée-V2',
          'DemandeComplèteRaccordementModifiée-V3',
        ),
      },
      (event) =>
        dossierRaccordement.DCR.mapToDemandeComplèteRaccordementModifiéeTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with({ type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1' }, (event) =>
      dossierRaccordement.DCR.mapToAccuséRéceptionDemandeComplèteRaccordementTransmisTimelineItemProps(
        event,
        raccordementIcon,
      ),
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
      (event) =>
        dossierRaccordement.PTF.mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with(
      {
        type: P.union(
          'PropositionTechniqueEtFinancièreModifiée-V1',
          'PropositionTechniqueEtFinancièreModifiée-V2',
        ),
      },
      (event) =>
        dossierRaccordement.PTF.mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    ///////////// Date de mise en service
    .with(
      {
        type: P.union('DateMiseEnServiceTransmise-V1', 'DateMiseEnServiceTransmise-V2'),
      },
      (event) =>
        dossierRaccordement.dateMiseEnService.mapToDateMiseEnServiceTransmiseTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with({ type: 'DateMiseEnServiceSupprimée-V1' }, (event) =>
      dossierRaccordement.dateMiseEnService.mapToDossierRacordementSuppriméTimelineItemProps(
        event,
        raccordementIcon,
      ),
    )

    /***
     * Gestionnaire de réseau
     */
    .with(
      {
        type: 'GestionnaireRéseauAttribué-V1',
      },
      (event) =>
        gestionnaireRéseau.mapToGestionnaireRéseauAttribuéTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    .with(
      {
        type: 'GestionnaireRéseauRaccordementModifié-V1',
      },
      (event) =>
        gestionnaireRéseau.mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps(
          event,
          raccordementIcon,
        ),
    )
    /**
     * Raccordement du projet
     */
    .with(
      {
        type: 'RaccordementSupprimé-V1',
      },
      (event) => mapToRacordementSuppriméTimelineItemProps(event, raccordementIcon),
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
