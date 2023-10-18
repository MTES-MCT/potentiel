import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PièceJustificativeAbandonValueType } from './pièceJustificativeAbandon.valueType';
import { RéponseSignéeValueType } from './réponseSignée.valueType';

export type EnregistrerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: PièceJustificativeAbandonValueType;
  datePièceJustificativeAbandon: DateTime.ValueType;
}) => Promise<void>;

export type EnregistrerRéponseSignéePort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: RéponseSignéeValueType;
  dateDocumentRéponseSignée: DateTime.ValueType;
}) => Promise<void>;

export type RécupérerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  format: string;
  datePièceJustificativeAbandon: DateTime.ValueType;
}) => Promise<ReadableStream | undefined>;

export type RécupérerRéponseSignéeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: RéponseSignéeValueType['type'];
  format: string;
  dateRécupérerRéponseSignée: DateTime.ValueType;
}) => Promise<ReadableStream | undefined>;
