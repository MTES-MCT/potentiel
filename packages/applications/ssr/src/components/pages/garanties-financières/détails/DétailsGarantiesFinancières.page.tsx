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
  afficherInfoConditionsMainLevée: boolean;
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  projet,
  actuelles,
  dépôtEnCours,
  action,
  mainLevée,
  afficherInfoConditionsMainLevée,
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
        {afficherInfoConditionsMainLevée && (
          <Alert
            severity="info"
            small
            description={
              <div className="p-3">
                Vous pouvez accéder à la demande de levée de vos garanties bancaires sur Potentiel
                si votre projet remplit toutes les conditions suivantes :
                <ul className="list-disc list-inside">
                  <li>
                    Le projet a des garanties financières validées (l'attestation de constitution
                    doit être transmise dans Potentiel)
                  </li>
                  <li>
                    Le projet ne dispose pas de demande de renouvellement ou de modifications de
                    garanties financières en cours
                  </li>
                  <li>
                    L'attestation de conformité a été transmise dans Potentiel ou le projet est
                    abandonné (abandon accordé par la DGEC)
                  </li>
                </ul>
              </div>
            }
          />
        )}
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
