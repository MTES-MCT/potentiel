import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  EnregistrerChangementProducteurForm,
  type EnregistrerChangementProducteurFormProps,
} from './EnregistrerChangementProducteur.form';
import {
  InfoBoxAprèsAchèvement,
  InfoBoxRenseignerOuCorrigerNuméroImmatriculation,
  InfoBoxRévocationDesDroits,
} from './InfoBoxProducteur';

export type EnregistrerChangementProducteurPageProps = EnregistrerChangementProducteurFormProps;

export const EnregistrerChangementProducteurPage: FC<EnregistrerChangementProducteurPageProps> = ({
  identifiantProjet,
  producteur,
  numéroIdentification,
}) => (
  <ColumnPageTemplate
    heading={<Heading1>Changer de producteur</Heading1>}
    leftColumn={{
      children: (
        <>
          <InfoBoxRévocationDesDroits />
          <EnregistrerChangementProducteurForm
            identifiantProjet={identifiantProjet}
            producteur={producteur}
            numéroIdentification={numéroIdentification}
          />
        </>
      ),
    }}
    rightColumn={{
      children: (
        <div className="flex flex-col gap-2">
          <InfoBoxRenseignerOuCorrigerNuméroImmatriculation
            identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
            numéroIdentification={numéroIdentification}
          />
          <InfoBoxAprèsAchèvement />
        </div>
      ),
    }}
  />
);
