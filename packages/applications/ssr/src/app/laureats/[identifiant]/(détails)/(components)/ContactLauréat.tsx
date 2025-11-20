'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

export const ContactLauréat = () => (
  <ColumnTemplate
    heading={<Heading1>Contact</Heading1>}
    leftColumn={{
      children: <div>Nom projet: coucou</div>,
    }}
    rightColumn={{
      children: (
        <ButtonsGroup
          buttonsSize="medium"
          buttonsEquisized
          alignment="center"
          inlineLayoutWhen="always"
          className="flex flex-col gap-1"
          buttons={[
            {
              children: 'Imprimer la page',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
            {
              children: 'Modifier le lauréat',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);
