import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderAbandonForm, DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = DemanderAbandonFormProps;

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
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
                <div className="text-justify">
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
