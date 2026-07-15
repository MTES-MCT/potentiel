import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { dossierRaccordement, gestionnaireRéseau } from './events';
import {
  mapToDocumentModifiéTimelineItemProps,
  mapToDocumentSuppriméTimelineItemProps,
  mapToDocumentTransmisTimelineItemProps,
} from './events/dossier/document';

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
        type: P.union('DossierDuRaccordementSupprimé-V1', 'DossierDuRaccordementSupprimé-V2'),
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
          'DemandeComplèteRaccordementModifiée-V4',
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
          'PropositionTechniqueEtFinancièreModifiée-V3',
        ),
      },
      dossierRaccordement.PTF.mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps,
    )
    ///////////// Document
    .with(
      {
        type: 'DocumentRaccordementTransmis-V1',
      },
      mapToDocumentTransmisTimelineItemProps,
    )
    .with(
      {
        type: 'DocumentRaccordementModifié-V1',
      },
      mapToDocumentModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'DocumentRaccordementSupprimé-V1',
      },
      mapToDocumentSuppriméTimelineItemProps,
    )
    ///////////// Date de mise en service
    .with(
      {
        type: P.union('DateMiseEnServiceTransmise-V1', 'DateMiseEnServiceTransmise-V2'),
      },
      dossierRaccordement.dateMiseEnService.mapToDateMiseEnServiceTransmiseTimelineItemProps,
    )
    .with(
      { type: P.union('DateMiseEnServiceModifiée-V1', 'DateMiseEnServiceModifiée-V2') },
      dossierRaccordement.dateMiseEnService.mapToDateMiseEnServiceModifiéeTimelineItemProps,
    )
    .with(
      { type: 'DateMiseEnServiceSupprimée-V1' },
      dossierRaccordement.dateMiseEnService.mapToDateMiseEnServiceSuppriméeTimelineItemProps,
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
        type: P.union(
          'GestionnaireRéseauRaccordementModifié-V1',
          'GestionnaireRéseauRaccordementModifié-V2',
        ),
      },
      gestionnaireRéseau.mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps,
    )
    .with(
      {
        type: P.union(
          'GestionnaireRéseauInconnuAttribué-V1',
          'RaccordementSupprimé-V1',
          'RaccordementRéactivé-V1',
        ),
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();
