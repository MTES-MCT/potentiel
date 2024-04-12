import type { Meta, StoryObj } from '@storybook/react';

import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesProps,
} from './ModifierGarantiesFinancièresActuelles.page';

const meta = {
  title: 'Pages/Garanties-financières/Actuelles/Modifier',
  component: ModifierGarantiesFinancièresActuellesPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGarantiesFinancièresActuellesProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierGarantiesFinancièresActuellesProps['projet'] = {
  identifiantProjet: 'identifiantProjet#1',
  appelOffre: 'Appel offre',
  période: 'Période',
  famille: 'Famille',
  nom: 'Nom du projet',
  dateDésignation: '2021-10-23',
  localité: {
    codePostal: 'XXXXX',
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
  statut: 'classé',
};

const typesGarantiesFinancières: ModifierGarantiesFinancièresActuellesProps['typesGarantiesFinancières'] =
  [
    {
      label: 'Consignation',
      value: 'consignation',
    },
    {
      label: "Avec date d'échéance",
      value: 'avec-date-échéance',
    },
    {
      label: 'Six mois après achèvement',
      value: 'six-mois-après-achèvement',
    },
  ];

export const Default: Story = {
  args: {
    projet,
    typesGarantiesFinancières,
    actuelles: {
      type: 'consignation',
      dateConstitution: '2021-10-23',
      soumisLe: '2022-01-01',
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: '2022-01-01',
        par: 'PORTEUR#1',
      },
    },
  },
};
