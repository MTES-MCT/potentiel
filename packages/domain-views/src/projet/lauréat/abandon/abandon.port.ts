import { DateTimeValueType, IdentifiantProjetValueType, RéponseSignée } from '@potentiel/domain';

export type RécupérerPiéceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  format: string;
  datePiéceJustificativeAbandon: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;

export type RécupérerRéponseSignéeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  type: RéponseSignée['type'];
  format: string;
  dateRécupérerRéponseSignée: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;
