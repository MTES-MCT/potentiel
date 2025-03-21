import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ColumnTemplate } from '@/components/templates/Column.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderAbandonForm, DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = DemanderAbandonFormProps;

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnTemplate
      heading={<Heading1>Demander l'abandon du projet</Heading1>}
      leftColumn={{
        children: <DemanderAbandonForm identifiantProjet={identifiantProjet} />,
      }}
      rightColumn={{
        children: (
          <div>
            <Alert
              severity="info"
              small
              description={
                <div className="py-4 text-justify">
                  Une fois votre demande d'abandon envoyée, la DGEC pourra vous demander une
                  confirmation avant de vous apporter une réponse définitive.
                  <br />
                  Toute réponse vous sera mise à disposition dans Potentiel et donnera lieu à une
                  notification par courriel.
                </div>
              }
            />
          </div>
        ),
      }}
    />
  );
};
