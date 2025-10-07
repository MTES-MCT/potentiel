import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet } from '../..';

// Transforme les clés qui peuvent être undefined en optionnelles
type MakeUndefinedOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type CandidatureImportéeEventPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  importéLe: DateTime.RawType;
  importéPar: Email.RawType;
} & MakeUndefinedOptional<Candidature.Dépôt.RawType> &
  Candidature.Instruction.RawType;

/**
 * @deprecated Ajoute les informations fournisseurs à une candidature importée avec CandidatureImportée-V1
 * Tous les évènements CandidatureImportée-V1 doivent avoir un évènement DétailsFournisseursCandidatureImportés-V1 associé
 */
export type DétailsFournisseursCandidatureImportésEvent = DomainEvent<
  'DétailsFournisseursCandidatureImportés-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs: CandidatureImportéeEventPayload['fournisseurs'];
  }
>;

/**
 * @deprecated Remplacé par CandidatureImportée-V2 qui ajoute les fournisseurs
 * L'évènement DétailsFournisseursCandidatureImportés-V1 permet d'ajouter les valeurs manquantes pour les candidatures importées avec la V1
 */
export type CandidatureImportéeEventV1 = DomainEvent<
  'CandidatureImportée-V1',
  Omit<CandidatureImportéeEventPayload, 'fournisseurs' | 'typologieInstallation'>
>;

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V2',
  CandidatureImportéeEventPayload
>;
