import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { Projection } from '@potentiel-libraries/projection';
import * as StatutAbandon from './statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';

export type AbandonProjection = Projection<
  'abandon',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    statut: StatutAbandon.RawType;

    demandeRaison: string;
    demandePièceJustificative?: DocumentProjet.RawType;
    demandeRecandidature: boolean;
    demandeDemandéPar: IdentifiantUtilisateur.RawType;
    demandeDemandéLe: DateTime.RawType;

    accordRéponseSignée?: DocumentProjet.RawType;
    accordAccordéPar?: IdentifiantUtilisateur.RawType;
    accordAccordéLe?: DateTime.RawType;

    rejetRéponseSignée?: DocumentProjet.RawType;
    rejetRejetéPar?: IdentifiantUtilisateur.RawType;
    rejetRejetéLe?: DateTime.RawType;

    confirmationDemandéePar?: IdentifiantUtilisateur.RawType;
    confirmationDemandéeLe?: DateTime.RawType;
    confirmationDemandéeRéponseSignée?: DocumentProjet.RawType;
    confirmationConfirméLe?: DateTime.RawType;
    confirmationConfirméPar?: IdentifiantUtilisateur.RawType;
  }
>;
