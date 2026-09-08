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
          title="Révocation des droits"
          description={
            <>
              <span>
                <br />
                Les droits du producteur actuel{' '}
                <span className="font-semibold">ne seront pas révoqués</span> à la soumission de ce
                formulaire.
              </span>
              <span>
                Les porteurs de projet peuvent déclarer ce changement eux-même, auquel cas leurs
                droits seront révoqués.
              </span>
            </>
          }
        />
      ),
    }}
  />
);
