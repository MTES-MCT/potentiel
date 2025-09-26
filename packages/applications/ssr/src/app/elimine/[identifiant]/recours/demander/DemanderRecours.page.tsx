import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderRecoursForm, DemanderRecoursFormProps } from './DemanderRecours.form';

export type DemanderRecoursPageProps = DemanderRecoursFormProps;

export const DemanderRecoursPage: FC<DemanderRecoursPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Demander un recours pour le projet</Heading1>}
      leftColumn={{
        children: <DemanderRecoursForm identifiantProjet={identifiantProjet} />,
      }}
      rightColumn={{
        children: (
          <div>
            <Alert
              severity="info"
              small
              description={
                <div className="py-4 text-justify">
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
