import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  CorrigerNuméroIdentificationForm,
  type CorrigerNuméroIdentificationFormProps,
} from './CorrigerNuméroIdentification.form';

export type CorrigerNuméroIdentificationPageProps = CorrigerNuméroIdentificationFormProps;

export const CorrigerNuméroIdentificationPage: FC<CorrigerNuméroIdentificationPageProps> = ({
  identifiantProjet,
  numéroIdentification,
}) => (
  <ColumnPageTemplate
    heading={<Heading1>Corriger le numéro d'identification</Heading1>}
    leftColumn={{
      children: (
        <CorrigerNuméroIdentificationForm
          identifiantProjet={identifiantProjet}
          numéroIdentification={numéroIdentification}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <>
              <p>
                Cette correction ne modifiera pas le producteur, et ne révoquera pas les droits sur
                ce projet.
              </p>
              <p>
                Si vous souhaitez enregistrer un changement de producteur du projet,{' '}
                <Link
                  href={Routes.Producteur.changement.enregistrer(
                    IdentifiantProjet.bind(identifiantProjet).formatter(),
                  )}
                >
                  vous pouvez le faire ici
                </Link>
                .
              </p>
            </>
          }
        />
      ),
    }}
  />
);
