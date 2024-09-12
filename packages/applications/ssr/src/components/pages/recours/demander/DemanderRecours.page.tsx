import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderRecoursForm, DemanderRecoursFormProps } from './DemanderRecours.form';

export type DemanderRecoursPageProps = DemanderRecoursFormProps;

export const DemanderRecoursPage: FC<DemanderRecoursPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Demander le recours du projet</Heading1>}
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
