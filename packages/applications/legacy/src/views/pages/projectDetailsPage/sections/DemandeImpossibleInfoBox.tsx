import React from 'react';
import { InfoBox } from '../../../components';
import { Routes } from '@potentiel-applications/routes';

type DemandeImpossibleSiAbandonEnCoursInfoBoxProps = {
  identifiantProjet: string;
};
export const DemandeImpossibleSiAbandonEnCoursInfoBox = ({
  identifiantProjet,
}: DemandeImpossibleSiAbandonEnCoursInfoBoxProps) => (
  <InfoBox>
    <span>
      Vous ne pouvez pas faire de demande ou de déclaration sur Potentiel car vous avez une demande
      d'abandon en cours pour ce projet. Si celle-ci n'est plus d'actualité, merci de l'annuler sur{' '}
      <a href={Routes.Abandon.détail(identifiantProjet)}>la page de la demande</a>.
    </span>
  </InfoBox>
);

export const DemandeImpossibleSiAchèvementInfoBox = () => (
  <InfoBox>
    <span>
      Ce projet est achevé car vous avez transmis l'attestation de conformité au cocontractant ;
      vous ne pouvez donc plus faire de demande ou déclaration de modification sur Potentiel. Il
      vous est toujours possible de mettre à jour les parties Garanties financières et Raccordement
      au réseau de votre projet.
    </span>
  </InfoBox>
);
