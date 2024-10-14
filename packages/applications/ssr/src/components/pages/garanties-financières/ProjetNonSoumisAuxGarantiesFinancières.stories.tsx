import type { Meta, StoryObj } from '@storybook/react';

import {
  ProjetNonSoumisAuxGarantiesFinancièresPage,
  ProjetNonSoumisAuxGarantiesFinancièresProps,
} from './ProjetNonSoumisAuxGarantiesFinancières.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières',
  component: ProjetNonSoumisAuxGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ProjetNonSoumisAuxGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjetNonSoumisAuxGarantiesFinancières: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
