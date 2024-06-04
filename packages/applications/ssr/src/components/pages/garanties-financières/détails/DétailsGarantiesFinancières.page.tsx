'use client';

import { FC } from 'react';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

import {
  GarantiesFinancièresActuelles,
  GarantiesFinancièresActuellesProps,
} from './components/GarantiesFinancièresActuelles';
import {
  GarantiesFinancièresDépôtEnCours,
  GarantiesFinancièresDépôtEnCoursProps,
} from './components/GarantiesFinancièresDépôtEnCours';

export type DétailsGarantiesFinancièresPageProps = {
  projet: ProjetBannerProps;
  actuelles?: GarantiesFinancièresActuellesProps['actuelles'];
  dépôtEnCours?: GarantiesFinancièresDépôtEnCoursProps['dépôt'];
  dateLimiteSoummission?: Iso8601DateTime;
  mainLevée?: GarantiesFinancièresActuellesProps['mainLevée'];
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  projet,
  actuelles,
  dépôtEnCours,
  action,
  mainLevée,
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
              mainLevée={mainLevée}
            />
          )}

          {dépôtEnCours && (
            <GarantiesFinancièresDépôtEnCours
              dépôt={dépôtEnCours}
              identifiantProjet={projet.identifiantProjet}
            />
          )}
        </div>
        {action === 'soumettre' && (
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
  </PageTemplate>
);
