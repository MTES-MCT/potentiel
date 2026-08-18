import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  ModifierProducteurForm,
  type ModifierProducteurFormProps,
} from './ModifierProducteur.form';

export type ModifierProducteurPageProps = ModifierProducteurFormProps;

export const ModifierProducteurPage: FC<ModifierProducteurPageProps> = ({
  identifiantProjet,
  producteur,
  numéroIdentification,
}) => (
  <ColumnPageTemplate
    heading={<Heading1>Modifier le producteur</Heading1>}
    leftColumn={{
      children: (
        <ModifierProducteurForm
          identifiantProjet={identifiantProjet}
          producteur={producteur}
          numéroIdentification={numéroIdentification}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Notice
          severity="info"
          title=""
          description={
            <>
              <p>
                Les droits du producteur actuel <b>ne seront pas révoqués</b> à la soumission de ce
                formulaire.
              </p>
              <p>
                Les porteurs de projet peuvent déclarer ce changement eux-même, auquel cas leurs
                droits seront révoqués.
              </p>
            </>
          }
        />
      ),
    }}
  />
);
