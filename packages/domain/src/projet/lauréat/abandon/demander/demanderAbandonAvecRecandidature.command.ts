import { Message } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { PiéceJustificativeAbandon } from '../abandon.valueType';

export type DemanderAbandonAvecRecandidatureCommand = Message<
  'DEMANDER_ABANDON_AVEC_RECANDIDATURE_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    raisonAbandon: string;
    piéceJustificative: PiéceJustificativeAbandon;
  }
>;
