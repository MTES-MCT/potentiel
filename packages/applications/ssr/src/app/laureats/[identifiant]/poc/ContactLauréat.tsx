'use client';

import { LauréatDétailsPageProps } from './LauréatDétails.page';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export const ContactLauréat: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
  <ColumnTemplate
    heading={<Heading1>Contact</Heading1>}
    leftColumn={{
      children: <div>Nom projet: {lauréat.nomProjet}</div>,
    }}
    rightColumn={{
      children: (
        <ButtonsGroup
          buttonsSize="medium"
          buttonsEquisized
          alignment="right"
          inlineLayoutWhen="always"
          buttons={[
            {
              children: 'Imprimer la page',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
              onClick: () => window.print(),
            },
            {
              children: 'Modifier le lauréat',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
              linkProps: {
                href: Routes.Lauréat.modifier(
                  IdentifiantProjet.bind(identifiantProjet).formatter(),
                ),
              },
            },
          ]}
        />
      ),
    }}
  />
);
