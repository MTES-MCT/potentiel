import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { DemanderRecoursForm, type DemanderRecoursFormProps } from './DemanderRecours.form';

export type DemanderRecoursPageProps = DemanderRecoursFormProps;

export const DemanderRecoursPage: FC<DemanderRecoursPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      heading={<Heading1>Demander un recours pour le projet</Heading1>}
      leftColumn={{
        children: <DemanderRecoursForm identifiantProjet={identifiantProjet} />,
      }}
      rightColumn={{
        children: (
          <div>
            <Notice
              severity="info"
              title="À la suite de votre demande"
              description={
                <span>
                  <br />
                  Toute réponse sera mise à disposition dans Potentiel et donnera lieu à une
                  notification par courriel.
                </span>
              }
            />
          </div>
        ),
      }}
    />
  );
};
