import { PiéceJustificativeAbandon, RéponseSignée } from './abandon.valueType';

export type EnregistrerPiéceJustificativeAbandonPort = (options: {
  identifiantProjet: string;
  piéceJustificative: PiéceJustificativeAbandon;
}) => Promise<void>;

export type EnregistrerRéponseSignéePort = (options: {
  identifiantProjet: string;
  réponseSignée: RéponseSignée;
}) => Promise<void>;
