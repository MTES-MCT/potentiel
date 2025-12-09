import { Routes } from '@potentiel-applications/routes';
import { InfoBox } from '../../../components';
import React from 'react';

type DemandeAbandonEnCoursInfoBoxProps = {
  identifiantProjet: string;
  dateDemande: string;
};

export const DemandeAbandonEnCoursInfoBox = ({
  identifiantProjet,
  dateDemande,
}: DemandeAbandonEnCoursInfoBoxProps) => (
  <InfoBox>
    <span>
      Une demande d'abandon est en cours pour ce projet, vous pouvez la consulter depuis{' '}
      <a href={Routes.Abandon.détail(identifiantProjet, dateDemande)}>la page de la demande</a>.
    </span>
  </InfoBox>
);
