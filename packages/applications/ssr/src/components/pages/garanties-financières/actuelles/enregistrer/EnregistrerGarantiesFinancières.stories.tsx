import type { Meta, StoryObj } from '@storybook/react';

import {
  EnregistrerGarantiesFinancièresPage,
  EnregistrerGarantiesFinancièresPageProps,
} from './EnregistrerGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Actuelles/Enregistrer',
  component: EnregistrerGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<EnregistrerGarantiesFinancièresPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const typesGarantiesFinancières: EnregistrerGarantiesFinancièresPageProps['typesGarantiesFinancières'] =
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
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    typesGarantiesFinancières,
  },
};
