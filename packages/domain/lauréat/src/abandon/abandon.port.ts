import { DateTimeValueType } from '../../common/dateTime.valueType';
import { IdentifiantProjetValueType } from '../../common/projet.valueType';
import { PièceJustificativeAbandon, RéponseSignée } from './abandon.valueType';

export type EnregistrerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  pièceJustificative: PièceJustificativeAbandon;
  datePièceJustificativeAbandon: DateTimeValueType;
}) => Promise<void>;

export type EnregistrerRéponseSignéePort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  réponseSignée: RéponseSignée;
  dateDocumentRéponseSignée: DateTimeValueType;
}) => Promise<void>;

export type RécupérerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  format: string;
  datePièceJustificativeAbandon: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;

export type RécupérerRéponseSignéeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  type: RéponseSignée['type'];
  format: string;
  dateRécupérerRéponseSignée: DateTimeValueType;
}) => Promise<ReadableStream | undefined>;
