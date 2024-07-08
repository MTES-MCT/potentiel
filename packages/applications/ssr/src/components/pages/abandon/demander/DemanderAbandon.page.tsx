import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderAbandonForm, DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = DemanderAbandonFormProps;

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({
  identifiantProjet,
  showRecandidatureCheckBox,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Demander l'abandon du projet</Heading1>}
      leftColumn={{
        children: (
          <DemanderAbandonForm
            identifiantProjet={identifiantProjet}
            showRecandidatureCheckBox={showRecandidatureCheckBox}
          />
        ),
      }}
      rightColumn={{
        children: (
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
        ),
      }}
    />
  );
};
