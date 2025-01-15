import { ProjectAppelOffre } from '../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Fournisseur } from '../../project';
import { ModificationRequestStatusDTO } from './ModificationRequestListItemDTO';

export type ModificationRequestPageDTO = {
  id: string;
  status: ModificationRequestStatusDTO;

  respondedBy?: string;
  respondedOn?: number;
  responseFile?: {
    filename: string;
    id: string;
  };

  versionDate: number;

  requestedOn: number;
  requestedBy: string;

  justification: string;
  attachmentFile?: {
    filename: string;
    id: string;
  };

  cancelledBy?: string;
  cancelledOn?: number;
  authority?: string;
  cahierDesCharges?: {
    url: string;
  } & (
    | {
        type: 'initial';
      }
    | {
        type: 'modifié';
        paruLe: string;
        alternatif?: true;
      }
  );

  project: {
    id: string;
    numeroCRE: string;
    nomProjet: string;
    nomCandidat: string;
    communeProjet: string;
    departementProjet: string;
    regionProjet: string;
    puissance: number;
    puissanceInitiale: number;
    unitePuissance: string;
    notifiedOn: number;
    completionDueOn: number;
    appelOffreId: string;
    periodeId: string;
    familleId: string | undefined;
    identifiantGestionnaire: string | undefined;
    actionnaire: string;
    potentielIdentifier: string;
    technologie: AppelOffre.Technologie;
    appelOffre?: ProjectAppelOffre;
    cahierDesChargesActuel: AppelOffre.CahierDesChargesRéférence;
    cahiersDesChargesUrl?: string;
    note: number;
  };
} & Variant;

type Variant =
  | { type: 'fournisseur'; fournisseurs: Fournisseur[]; evaluationCarbone?: number }
  | { type: 'producteur'; producteur: string }
  | { type: 'puissance'; puissance: number; puissanceAuMomentDuDepot?: number }
  | { type: 'recours' }
  | ({
      type: 'delai';
      acceptanceParams?: { delayInMonths: number; dateAchèvementAccordée?: string };
      délaiAccordéCorrigéLe?: string;
      délaiAccordéCorrigéPar?: string;
      dateAchèvementAprèsCorrectionDélaiAccordé?: string;
    } & (
      | { delayInMonths: number; dateAchèvementDemandée?: undefined }
      | {
          delayInMonths?: undefined;
          dateAchèvementDemandée: string;
        }
    ));

export type DetailDemandeDelaiPageDTO = ModificationRequestPageDTO & { type: 'delai' };
