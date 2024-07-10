import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

import {
  GarantiesFinancièresActuelles,
  GarantiesFinancièresActuellesProps,
} from './components/GarantiesFinancièresActuelles';
import {
  GarantiesFinancièresDépôtEnCours,
  GarantiesFinancièresDépôtEnCoursProps,
} from './components/GarantiesFinancièresDépôtEnCours';
import { InfoBoxMainlevée } from './components/InfoBoxMainlevée';
import { InfoBoxSoumettreGarantiesFinancières } from './components/InfoBoxSoummettreGarantiesFinancières';

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  actuelles?: GarantiesFinancièresActuellesProps['actuelles'];
  dépôtEnCours?: GarantiesFinancièresDépôtEnCoursProps['dépôt'];
  dateLimiteSoummission?: Iso8601DateTime;
  mainlevée?: GarantiesFinancièresActuellesProps['mainlevée'];
  historiqueMainlevée?: GarantiesFinancièresActuellesProps['historiqueMainlevée'];
  afficherInfoConditionsMainlevée: boolean;
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  dépôtEnCours,
  action,
  mainlevée,
  historiqueMainlevée,
  afficherInfoConditionsMainlevée,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />
    {actuelles || dépôtEnCours ? (
      <>
        <div className="flex flex-col lg:flex-row gap-4">
          {actuelles && (
            <GarantiesFinancièresActuelles
              actuelles={actuelles}
              identifiantProjet={identifiantProjet}
              mainlevée={mainlevée}
              historiqueMainlevée={historiqueMainlevée}
            />
          )}

          {dépôtEnCours && (
            <GarantiesFinancièresDépôtEnCours
              dépôt={dépôtEnCours}
              identifiantProjet={identifiantProjet}
            />
          )}
        </div>
        {afficherInfoConditionsMainlevée && <InfoBoxMainlevée />}
        {action === 'soumettre' && (
          <InfoBoxSoumettreGarantiesFinancières identifiantProjet={identifiantProjet} />
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
              href={Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet)}
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
              href={Routes.GarantiesFinancières.actuelles.enregistrer(identifiantProjet)}
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
