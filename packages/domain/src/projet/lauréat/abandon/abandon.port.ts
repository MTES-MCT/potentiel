import { DateTimeValueType } from '../../../common/common.valueType';
import { IdentifiantProjetValueType } from '../../projet.valueType';
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
