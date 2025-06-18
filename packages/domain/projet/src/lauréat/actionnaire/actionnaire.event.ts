import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

export type ActionnaireEvent = ActionnaireImportéEvent;

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

export type ActionnaireModifiéEvent = DomainEvent<
  'ActionnaireModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type ChangementActionnaireAccordéEvent = DomainEvent<
  'ChangementActionnaireAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
    nouvelActionnaire: string;
  }
>;

export type ChangementActionnaireAnnuléEvent = DomainEvent<
  'ChangementActionnaireAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type ChangementActionnaireDemandéEvent = DomainEvent<
  'ChangementActionnaireDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type ChangementActionnaireEnregistréEvent = DomainEvent<
  'ChangementActionnaireEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type ChangementActionnaireRejetéEvent = DomainEvent<
  'ChangementActionnaireRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
