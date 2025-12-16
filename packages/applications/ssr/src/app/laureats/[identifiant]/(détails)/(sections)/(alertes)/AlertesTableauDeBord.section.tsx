import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { getAbandon } from '../../_helpers/getAbandon';
import { getAchèvement } from '../../_helpers/getAchèvement';

import { Alerte, AlertesTableauDeBord } from './AlertesTableauDeBord';

type AlertesTableauDeBordSectionProps = {
  identifiantProjet: string;
};

export const AlertesTableauDeBordSection = ({
  identifiantProjet: identifiantProjetValue,
}: AlertesTableauDeBordSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const abandon = await getAbandon(identifiantProjet.formatter());
    const achèvement = await getAchèvement(identifiantProjet.formatter());

    const abandonAlertes = await getAbandonAlert(
      identifiantProjet,
      rôle,
      !!abandon?.estAbandonné,
      abandon?.demandeEnCours ? abandon.demandéLe.formatter() : undefined,
    );
    const achèvementAlertes = await getAchèvementAlert(achèvement.estAchevé, rôle);

    if (!abandonAlertes && !achèvementAlertes) {
      return null;
    }

    return (
      <div>
        <AlertesTableauDeBord abandon={abandonAlertes} achèvement={achèvementAlertes} />
      </div>
    );
  });

const getAbandonAlert = (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: Role.ValueType,
  estAbandonné: boolean,
  dateDemandeEnCours?: DateTime.RawType,
): Alerte | undefined => {
  if (estAbandonné) {
    return {
      label: "L'abandon de ce projet a été accordé.",
    };
  }

  if (!dateDemandeEnCours || !(rôle.estDreal() || rôle.estDGEC() || rôle.estPorteur())) {
    return undefined;
  }

  return {
    label: rôle.estPorteur()
      ? "Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une demande d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de l'annuler."
      : "Une demande d'abandon est en cours pour ce projet.",
    url: Routes.Abandon.détail(identifiantProjet.formatter(), dateDemandeEnCours),
  };
};

const getAchèvementAlert = (estAchevé: boolean, rôle: Role.ValueType): Alerte | undefined => {
  if (!estAchevé || !rôle.estPorteur()) {
    return undefined;
  }

  return {
    label:
      "Ce projet est achevé car vous avez transmis l'attestation de conformité au cocontractant. Vous ne pouvez donc plus faire de demande ou déclaration de modification sur Potentiel. Il vous est toujours possible de mettre à jour les parties Garanties financières et Raccordement au réseau de votre projet.",
  };
};
