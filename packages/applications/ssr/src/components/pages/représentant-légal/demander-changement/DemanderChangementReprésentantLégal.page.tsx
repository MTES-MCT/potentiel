import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import {
  DemanderChangementReprésentantLégalForm,
  DemanderChangementReprésentantLégalFormProps,
} from './DemanderChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps =
  DemanderChangementReprésentantLégalFormProps;

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Demander un recours pour le projet</Heading1>}
      leftColumn={{
        children: <DemanderChangementReprésentantLégalForm identifiantProjet={identifiantProjet} />,
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
