import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export type AbandonAlertData =
  | undefined
  | {
      label: string;
      url?: string;
    };

type Props = {
  estAbandonné: boolean;
  rôle: Role.ValueType;
  identifiantProjet: IdentifiantProjet.RawType;
  demandeEnCours?: {
    dateDemandeEnCours: DateTime.RawType;
  };
};

export const getAbandonAlert = ({
  estAbandonné,
  rôle,
  identifiantProjet,
  demandeEnCours,
}: Props): AbandonAlertData => {
  if (estAbandonné) {
    return {
      label: "L'abandon de ce projet a été accordé.",
    };
  }

  if (!demandeEnCours || !(rôle.estDreal() || rôle.estDGEC() || rôle.estPorteur())) {
    return undefined;
  }

  return {
    label: rôle.estPorteur()
      ? "Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de l'annuler."
      : "Une demande d'abandon est en cours pour ce projet.",
    url: Routes.Abandon.détail(identifiantProjet, demandeEnCours.dateDemandeEnCours),
  };
};
