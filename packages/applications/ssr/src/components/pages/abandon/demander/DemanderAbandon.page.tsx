import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import { headers } from 'next/headers';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderAbandonForm, DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = Omit<DemanderAbandonFormProps, 'csrfToken'>;

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({ identifiantProjet }) => {
  const csrfToken = headers().get('X-CSRF-Token') || 'no_token';

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Demander l'abandon du projet</Heading1>}
      leftColumn={{
        children: (
          <DemanderAbandonForm identifiantProjet={identifiantProjet} csrfToken={csrfToken} />
        ),
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
