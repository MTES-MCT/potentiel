'use client';

import { LauréatDétailsPageProps } from './LauréatDétails.page';
import { Heading1, Heading4 } from '@/components/atoms/headings';
import { ColumnTemplate } from '@/components/templates/Column.templace';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

export const MatérielEtTechnologieSection: React.FC<LauréatDétailsPageProps> = ({
  identifiantProjet,
  lauréat,
  actions,
}) => (
  <ColumnTemplate
    heading={<Heading1>Matériel et Technologies</Heading1>}
    leftColumn={{
      children: <MatérielEtTechnologie />,
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
              children: 'Modifier les fournisseurs',
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
            {
              children: "Modifier l'évaluation carbone",
              iconId: 'fr-icon-mail-line',
              priority: 'secondary',
            },
          ]}
        />
      ),
    }}
  />
);

const MatérielEtTechnologie = () => (
  <div className="flex flex-col gap-4">
    <div>
      <Heading4 className="m-0">Évaluation carbone simplifiée</Heading4>
      <span>55 kg eq CO2/kWc</span>
    </div>

    <div>
      <Heading4 className="mb-0">Fournisseurs</Heading4>
      <li key={1}>
        <span>Postes de conversion : Samsung</span>
      </li>
      <li key={2}>
        <span>Autres : Apple</span>
      </li>
    </div>
  </div>
);
