import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { EnregistrerChangementProducteurForm } from './EnregistrerChangementProducteur.form';
import {
  InfoBoxAprèsAchèvement,
  InfoBoxCorrection,
  InfoBoxRévocationDesDroits,
} from './InfoBoxProducteur';

export type EnregistrerChangementProducteurPageProps =
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>;

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
          <InfoBoxCorrection
            identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
          />
          <InfoBoxAprèsAchèvement />
        </div>
      ),
    }}
  />
);
