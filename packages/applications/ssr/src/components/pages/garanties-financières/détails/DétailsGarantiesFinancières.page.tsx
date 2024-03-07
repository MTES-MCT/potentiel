'use client';

import { FC } from 'react';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { AucuneGarantiesFinancières } from './components/AucuneGarantiesFinancières';
import {
  GarantiesFinancièresActuelles,
  GarantiesFinancièresActuellesProps,
} from './components/GarantiesFinancièresActuelles';
import {
  DépôtGarantiesFinancières,
  GarantiesFinancièresHistoriqueDépôts,
  GarantiesFinancièresHistoriqueDépôtsProps,
} from './components/GarantiesFinancièresHistoriqueDépôts';
import { GarantiesFinancièresDépôtEnCours } from './components/GarantiesFinancièresDépôtEnCours';

export type DétailsGarantiesFinancièresPageProps = {
  projet: ProjetBannerProps;
  actuelles?: GarantiesFinancièresActuellesProps['actuelles'];
  dépôtEnCours?: DépôtGarantiesFinancières & {
    action?: 'modifier';
  };
  dateLimiteSoummission?: string;
  historiqueDépôts: GarantiesFinancièresHistoriqueDépôtsProps['dépôts'];
  action?: 'soumettre';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  projet,
  actuelles,
  dépôtEnCours,
  historiqueDépôts,
  action,
}) => {
  if (!actuelles && !dépôtEnCours && !historiqueDépôts.length && action) {
    return <AucuneGarantiesFinancières projet={projet} action={action} />;
  }

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      {actuelles && (
        <GarantiesFinancièresActuelles
          actuelles={actuelles}
          identifiantProjet={projet.identifiantProjet}
        />
      )}

      {dépôtEnCours && (
        <GarantiesFinancièresDépôtEnCours
          dépôt={dépôtEnCours}
          identifiantProjet={projet.identifiantProjet}
        />
      )}

      {historiqueDépôts.length === 0 && action === 'soumettre' && (
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

      {historiqueDépôts.length > 0 && (
        <GarantiesFinancièresHistoriqueDépôts
          identifiantProjet={projet.identifiantProjet}
          dépôts={historiqueDépôts}
        />
      )}
    </PageTemplate>
  );
};
