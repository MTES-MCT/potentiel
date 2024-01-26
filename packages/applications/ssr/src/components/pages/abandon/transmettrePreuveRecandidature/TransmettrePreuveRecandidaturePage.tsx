'use client';

import { PageTemplate } from '@/components/templates/PageTemplate';
import {
  TransmettrePreuveRecandidatureForm,
  TransmettrePreuveRecandidatureFormProps,
} from './TransmettrePreuveRecandidatureForm';
import { FC } from 'react';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

export type TransmettrePreuveRecandidaturePageProps = {
  projet: ProjetBannerProps;
  projetsÀSélectionner: TransmettrePreuveRecandidatureFormProps['projetsÀSélectionner'];
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
  projetsÀSélectionner,
}) => {
  return (
    <PageTemplate
      type="projet"
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
    </PageTemplate>
  );
};
