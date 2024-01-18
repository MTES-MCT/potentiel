'use client';

import { FC } from 'react';

import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';

import { TransmettrePreuveRecandidatureForm } from './TransmettrePreuveRecandidatureForm';

export type TransmettrePreuveRecandidaturePageProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  projetsÀSélectionner: Parameters<
    typeof TransmettrePreuveRecandidatureForm
  >[0]['projetsÀSélectionner'];
  identifiantUtilisateur: Parameters<
    typeof TransmettrePreuveRecandidatureForm
  >[0]['identifiantUtilisateur'];
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
  projetsÀSélectionner,
  identifiantUtilisateur,
}) => {
  return (
    <ProjetPageTemplate
      projet={projet}
      heading={
        <div className="flex flex-row gap-3 items-center">
          <span>Transmettre preuve de recandidature</span>
        </div>
      }
    >
      {projetsÀSélectionner.length > 0 ? (
        <TransmettrePreuveRecandidatureForm
          identifiantProjet={projet.identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
          projetsÀSélectionner={projetsÀSélectionner}
        />
      ) : (
        <p>Vous ne disposez d'aucun projet éligible avec une preuve de recandidature</p>
      )}
    </ProjetPageTemplate>
  );
};
