'use client';

import React, { FC } from 'react';
import { notFound } from 'next/navigation';

import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { ModifierGarantiesFinancières } from './modifier/ModifierGarantiesFinancières';
import { ConsulterGarantiesFinancières } from './consulter/ConsulterGarantiesFinancières';

export type GarantiesFinancières = {
  type: string;
  dateÉchéance?: string;
  dateConsitution: string;
  attestationConstitution: string;
};

export type DétailsGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  garantiesFinancieres: {
    actuelles?: GarantiesFinancières;
    dépôt?: GarantiesFinancières;
  };
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres: { actuelles, dépôt },
}) => {
  if (!actuelles && !dépôt) {
    return notFound();
  }

  if (actuelles) {
    return (
      <ConsulterGarantiesFinancières
        projet={projet}
        garantiesFinancieres={actuelles}
        // to do : ajouter les actions possible depuis la page.tsx
        actions={['accorder', 'rejeter']}
      />
    );
  }

  if (dépôt) {
    return <ModifierGarantiesFinancières projet={projet} garantiesFinancieres={dépôt} />;
  }

  return null;
};
