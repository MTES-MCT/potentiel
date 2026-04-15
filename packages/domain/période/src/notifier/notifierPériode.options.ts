import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export type NotifierPériodeOptions = {
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  identifiantLauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  identifiantÉliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
};
