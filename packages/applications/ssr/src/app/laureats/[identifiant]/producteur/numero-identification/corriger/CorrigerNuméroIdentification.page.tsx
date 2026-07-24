import Notice from '@codegouvfr/react-dsfr/Notice';
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
}) => {
  return (
    <ColumnPageTemplate
      heading={
        <Heading1>
          {numéroIdentification ? 'Corriger' : 'Renseigner'} le numéro d'identification
        </Heading1>
      }
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
          <Notice
            severity="info"
            title="Producteur"
            description={
              <span>
                <br />
                Si vous souhaitez modifier le producteur, veuillez vous rendre sur le formulaire
                dédié.
              </span>
            }
            link={{
              linkProps: {
                href: Routes.Producteur.changement.enregistrer(
                  IdentifiantProjet.bind(identifiantProjet).formatter(),
                ),
                target: '_self',
              },
              text: 'Changer le producteur',
            }}
          />
        ),
      }}
    />
  );
};
