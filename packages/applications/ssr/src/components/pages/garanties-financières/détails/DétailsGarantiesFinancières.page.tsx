'use client';

import { FC } from 'react';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

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
    action?: 'modifier' | 'instruire';
  };
  dateLimiteSoummission?: string;
  historiqueDépôts: GarantiesFinancièresHistoriqueDépôtsProps['dépôts'];
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  projet,
  actuelles,
  dépôtEnCours,
  historiqueDépôts,
  action,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />

    {actuelles || dépôtEnCours ? (
      <>
        <div className="flex flex-col lg:flex-row gap-4">
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
        </div>
        {historiqueDépôts.length === 0 && action === 'soumettre' && (
          <Alert
            severity="info"
            small
            description={
              <div className="p-3">
                Vous pouvez{' '}
                <Link
                  href={Routes.GarantiesFinancières.dépôt.soumettre(projet.identifiantProjet)}
                  className="font-semibold"
                >
                  soumettre de nouvelles garanties financières
                </Link>{' '}
                qui seront validées par l'autorité compétente
              </div>
            }
          />
        )}
      </>
    ) : (
      <p>
        Aucune garanties financières pour ce projet.
        {action === 'soumettre' && (
          <>
            {' '}
            Vous pouvez en{' '}
            <Link
              href={Routes.GarantiesFinancières.dépôt.soumettre(projet.identifiantProjet)}
              className="font-semibold"
            >
              soumettre des nouvelles
            </Link>{' '}
            qui seront validées par l'autorité compétente
          </>
        )}
        {action === 'enregistrer' && (
          <>
            {' '}
            Vous pouvez enregistrer des garanties financières en{' '}
            <Link
              href={Routes.GarantiesFinancières.actuelles.enregistrer(projet.identifiantProjet)}
              className="font-semibold"
            >
              suivant ce lien
            </Link>
          </>
        )}
      </p>
    )}

    {historiqueDépôts.length > 0 && (
      <GarantiesFinancièresHistoriqueDépôts
        identifiantProjet={projet.identifiantProjet}
        dépôts={historiqueDépôts}
      />
    )}
  </PageTemplate>
);
