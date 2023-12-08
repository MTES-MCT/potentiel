'use client';

import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';
import { DemanderAbandonForm } from './demander/DemanderAbandonForm';

export type DemanderAbandonPageProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  utilisateur: Parameters<typeof DemanderAbandonForm>[0]['utilisateur'];
};

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({ projet, utilisateur }) => {
  return (
    <ProjetPageTemplate projet={projet} heading={<span>Je demande un abandon de mon projet</span>}>
      <DemanderAbandonForm identifiantProjet={projet.identifiantProjet} utilisateur={utilisateur} />
    </ProjetPageTemplate>
  );
};
