import { DateTimeValueType } from '../../../common.valueType';
import { IdentifiantProjetValueType } from '../../projet.valueType';
import { PiéceJustificativeAbandon, RéponseSignée } from './abandon.valueType';

export type EnregistrerPiéceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  piéceJustificative: PiéceJustificativeAbandon;
  datePiéceJustificativeAbandon: DateTimeValueType;
}) => Promise<void>;

export type EnregistrerRéponseSignéePort = (options: {
  identifiantProjet: IdentifiantProjetValueType;
  réponseSignée: RéponseSignée;
  dateDocumentRéponseSignée: DateTimeValueType;
}) => Promise<void>;
