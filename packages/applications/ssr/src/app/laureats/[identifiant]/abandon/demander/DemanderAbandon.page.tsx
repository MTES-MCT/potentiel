import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { DemanderAbandonForm, DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = DemanderAbandonFormProps & {
  autoritéCompétente: Lauréat.Abandon.AutoritéCompétente.RawType;
};

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({
  identifiantProjet,
  autoritéCompétente,
}) => {
  const autoritéCompétenteText =
    autoritéCompétente === 'dgec'
      ? "Une fois votre demande d'abandon envoyée, la DGEC pourra vous demander une confirmation avant de vous apporter une réponse définitive."
      : "Une fois votre demande d'abandon envoyée, les services de l'état en région ou la DGEC pourront vous demander une confirmation avant de vous apporter une réponse définitive.";

  return (
    <ColumnPageTemplate
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
                  {autoritéCompétenteText}
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
