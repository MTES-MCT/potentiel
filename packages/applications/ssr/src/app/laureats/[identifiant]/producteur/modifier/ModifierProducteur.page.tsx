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
          title="Conséquences du changement de producteur"
          description={
            <span className="flex flex-col gap-2">
              <span>
                Accès
                <br />
                <span className="font-semibold">
                  Les droits du producteur actuel ne sont pas révoqués
                </span>{' '}
                à la soumission de ce formulaire. Ils ne le sont que lorsque le porteur de projet
                déclare lui-même le changement.
              </span>
              <span>
                Garanties financières
                <br />
                Ce changement n’entraîne pas la suppression des garanties financières actuelles sur
                Potentiel, qui{' '}
                <span className="font-semibold">restent donc celles de l’ancien producteur</span>.
                Le nouveau producteur devra fournir ses propres garanties financières : pensez à en
                suivre la mise à jour sur le projet.
              </span>
            </span>
          }
        />
      ),
    }}
  />
);
