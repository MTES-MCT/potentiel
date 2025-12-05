import { DateTime, Email } from '@potentiel-domain/common';

export type ConfirmerOptions = {
  dateConfirmation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
};
