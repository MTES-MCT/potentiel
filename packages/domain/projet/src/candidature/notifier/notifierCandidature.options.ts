import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';

export type NotifierOptions = {
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  validateur: AppelOffre.Validateur;
  attestation: {
    format: string;
  };
};
