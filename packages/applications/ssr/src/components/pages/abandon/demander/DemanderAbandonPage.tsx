'use client';

import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';
import { DemanderAbandonForm } from './DemanderAbandonForm';

export type DemanderAbandonPageProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  identifiantUtilisateur: Parameters<typeof DemanderAbandonForm>[0]['identifiantUtilisateur'];
  showRecandidatureCheckBox: boolean;
};

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({
  projet,
  identifiantUtilisateur,
  showRecandidatureCheckBox,
}) => {
  return (
    <ProjetPageTemplate projet={projet} heading={<span>Je demande un abandon de mon projet</span>}>
      <DemanderAbandonForm
        identifiantProjet={projet.identifiantProjet}
        identifiantUtilisateur={identifiantUtilisateur}
        showRecandidatureCheckBox={showRecandidatureCheckBox}
      />
    </ProjetPageTemplate>
  );
};
