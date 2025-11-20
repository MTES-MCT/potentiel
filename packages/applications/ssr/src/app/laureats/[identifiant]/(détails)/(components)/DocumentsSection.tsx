'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';

// l'onglet pour ses documents
// retrouver les documents à télécharger
// alertes sur les documents manquants ?

export const DocumentSection = () => (
  <ColumnTemplate
    heading={<Heading2>Mes documents pour ce projet</Heading2>}
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
