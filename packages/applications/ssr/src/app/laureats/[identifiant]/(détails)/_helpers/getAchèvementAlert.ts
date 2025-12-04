import { Role } from '@potentiel-domain/utilisateur';

export type AchèvementAlertData =
  | undefined
  | {
      label: string;
    };

export const getAchèvementAlert = (
  estAchevé: boolean,
  rôle: Role.ValueType,
): AchèvementAlertData => {
  if (!estAchevé || !rôle.estPorteur()) {
    return undefined;
  }

  return {
    label:
      "Ce projet est achevé car vous avez transmis l'attestation de conformité au cocontractant. Vous ne pouvez donc plus faire de demande ou déclaration de modification sur Potentiel. Il vous est toujours possible de mettre à jour les parties Garanties financières et Raccordement au réseau de votre projet.",
  };
};
