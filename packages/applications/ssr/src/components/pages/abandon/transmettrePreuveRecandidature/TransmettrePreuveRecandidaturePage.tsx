'use client';

import { FC } from 'react';

import { PageTemplate } from '@/components/templates/PageTemplate';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';

import {
  TransmettrePreuveRecandidatureForm,
  TransmettrePreuveRecandidatureFormProps,
} from './TransmettrePreuveRecandidatureForm';

export type TransmettrePreuveRecandidaturePageProps = {
  projet: ProjetBannerProps;
  projetsÀSélectionner: TransmettrePreuveRecandidatureFormProps['projetsÀSélectionner'];
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
  projetsÀSélectionner,
}) => {
  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <Heading1>Transmettre preuve de recandidature</Heading1>
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
