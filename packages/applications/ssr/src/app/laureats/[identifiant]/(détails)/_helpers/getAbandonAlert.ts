import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export type AbandonAlertData =
  | undefined
  | {
      label: string;
      url: string;
    };

export const getAbandonAlert = (
  abandonEnCours: boolean,
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.RawType,
): AbandonAlertData => {
  if (!abandonEnCours || !(rôle.estDreal() || rôle.estDGEC() || rôle.estPorteur())) {
    return undefined;
  }

  return {
    label: rôle.estPorteur()
      ? "Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de l'annuler."
      : "Une demande d'abandon est en cours pour ce projet.",
    url: Routes.Abandon.détail(identifiantProjet),
  };
};
