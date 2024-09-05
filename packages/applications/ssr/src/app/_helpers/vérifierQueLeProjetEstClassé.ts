import { StatutProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { InvalidOperationError } from '@potentiel-domain/core';

type VérifierQueLeProjetEstClasséProps = {
  statut: Candidature.ConsulterProjetReadModel['statut'];
  message?: string;
};

/**
 * @param statut Le statut du projet
 * @param message Surcharge du message d'erreur
 * @default message `Vous ne pouvez pas accèder à cette page car le projet n'est pas classé`
 */
export const vérifierQueLeProjetEstClassé = async ({
  statut,
  message = `Vous ne pouvez pas accèder à cette page car le projet n'est pas classé`,
}: VérifierQueLeProjetEstClasséProps) => {
  if (!StatutProjet.convertirEnValueType(statut).estClassé()) {
    throw new InvalidOperationError(message);
  }
};
