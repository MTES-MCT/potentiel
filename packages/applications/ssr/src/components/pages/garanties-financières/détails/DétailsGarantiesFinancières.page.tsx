'use client';

import { FC } from 'react';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

import { AucuneGarantiesFinancières } from './components/AucuneGarantiesFinancières';
import {
  GarantiesFinancièresActuelles,
  GarantiesFinancièresActuellesProps,
} from './components/GarantiesFinancièresActuelles';
import {
  HistoriqueDesGarantiesFinancièresDéposées,
  HistoriqueDesGarantiesFinancièresDéposéesProps,
} from './components/HistoriqueDesGarantiesFinancièresDéposées';

export type DétailsGarantiesFinancièresPageProps = {
  projet: ProjetBannerProps;
  actuelles?: GarantiesFinancièresActuellesProps['actuelles'];
  dateLimiteSoummission?: string;
  dépôts: HistoriqueDesGarantiesFinancièresDéposéesProps['dépôts'];
  action?: 'soumettre';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  projet,
  actuelles,
  dépôts,
  action,
}) => {
  if (!actuelles && !dépôts.length && action) {
    return <AucuneGarantiesFinancières projet={projet} action={action} />;
  }

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières />

      {actuelles && (
        <GarantiesFinancièresActuelles
          actuelles={actuelles}
          identifiantProjet={projet.identifiantProjet}
        />
      )}

      {dépôts.length === 0 && action === 'soumettre' && (
        <Alert
          severity="info"
          small
          description={
            <div className="p-3">
              Vous pouvez{' '}
              <Link
                href={Routes.GarantiesFinancières.soumettre(projet.identifiantProjet)}
                className="font-semibold"
              >
                soumettre de nouvelles garanties financières
              </Link>{' '}
              qui seront validées par l'autorité compétente
            </div>
          }
        />
      )}

      {dépôts.length > 0 && (
        <HistoriqueDesGarantiesFinancièresDéposées
          identifiantProjet={projet.identifiantProjet}
          dépôts={dépôts}
        />
      )}
    </PageTemplate>
  );
};
