import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  ModifierNomLocalitéLauréatForm,
  ModifierNomLocalitéLauréatFormProps,
} from './ModifierNomLocalitéLauréat.form';

export type ModifierNomEtLocalitéProjetPageProps = ModifierNomLocalitéLauréatFormProps;

export const ModifierNomEtLocalitéProjetPage: FC<ModifierNomEtLocalitéProjetPageProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    heading={<Heading1>Modifier le projet lauréat</Heading1>}
    leftColumn={{
      children: (
        <ModifierNomLocalitéLauréatForm
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          nomProjet={nomProjet}
          localité={localité}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          title="Concernant la modification"
          description={
            <div className="py-4 text-justify">
              Cette modification s'applique à un changement au cours de la vie du projet. Pour
              corriger la valeur à la candidature, utilisez{' '}
              <Link
                href={Routes.Candidature.corriger(
                  IdentifiantProjet.bind(identifiantProjet).formatter(),
                )}
              >
                le formulaire de correction de la candidature
              </Link>
              .
            </div>
          }
        />
      ),
    }}
  />
);
