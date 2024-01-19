'use client';

import { FC } from 'react';

import {
  ProjetPageTemplate,
  ProjetPageTemplateProps,
} from '@/components/templates/ProjetPageTemplate';

import {
  TransmettrePreuveRecandidatureForm,
  TransmettrePreuveRecandidatureFormProps,
} from './TransmettrePreuveRecandidatureForm';

export type TransmettrePreuveRecandidaturePageProps = {
  projet: ProjetPageTemplateProps['projet'];
  projetsÀSélectionner: TransmettrePreuveRecandidatureFormProps['projetsÀSélectionner'];
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
  projetsÀSélectionner,
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
          projetsÀSélectionner={projetsÀSélectionner}
        />
      ) : (
        <p>Vous ne disposez d'aucun projet éligible avec une preuve de recandidature</p>
      )}
    </ProjetPageTemplate>
  );
};
