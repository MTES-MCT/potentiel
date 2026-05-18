import Alert from '@codegouvfr/react-dsfr/Alert';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { DemanderAbandonForm, type DemanderAbandonFormProps } from './DemanderAbandon.form';

export type DemanderAbandonPageProps = DemanderAbandonFormProps & {
  autoritéCompétente: Lauréat.Abandon.AutoritéCompétente.RawType;
};

export const DemanderAbandonPage: FC<DemanderAbandonPageProps> = ({
  identifiantProjet,
  autoritéCompétente,
  estDéjàSignaléPPA,
}) => {
  const autoritéCompétenteText =
    autoritéCompétente === 'dgec'
      ? "Une fois votre demande d'abandon envoyée, la DGEC pourra vous demander une confirmation avant de vous apporter une réponse définitive."
      : "Une fois votre demande d'abandon envoyée, les services de l'état en région ou la DGEC pourront vous demander une confirmation avant de vous apporter une réponse définitive.";

  return (
    <ColumnPageTemplate
      heading={<Heading1>Demander l'abandon du projet</Heading1>}
      leftColumn={{
        children: (
          <DemanderAbandonForm
            identifiantProjet={identifiantProjet}
            estDéjàSignaléPPA={estDéjàSignaléPPA}
          />
        ),
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
