'use client';

import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';
import { DemanderAbandonForm } from '@/components/molecules/abandon/DemanderAbandonForm';

export type DemanderAbandonPageProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
};

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({ projet }) => {
  return (
    <ProjetPageTemplate projet={projet} heading={<span>Je demande un abandon de mon projet</span>}>
      <DemanderAbandonForm identifiantProjet={projet.identifiantProjet} />
    </ProjetPageTemplate>
  );
};
