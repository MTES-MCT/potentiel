import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
