import { DateTimeValueType, IdentifiantProjetValueType, RéponseSignée } from '@potentiel/domain';

export type RécupérerPiéceJustificativeAbandonProjetPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  format: string;
  datePiéceJustificativeAbandon: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;

export type RécupérerRéponseSignée = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  type: RéponseSignée['type'];
  format: string;
  dateRécupérerRéponseSignée: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;
