import type { Meta, StoryObj } from '@storybook/react';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

import {
  SoumettreGarantiesFinancièresPage,
  SoumettreGarantiesFinancièresProps,
} from './SoumettreGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Soumettre',
  component: SoumettreGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<SoumettreGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const typesGarantiesFinancières: SoumettreGarantiesFinancièresProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

export const Default: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
    typesGarantiesFinancières,
  },
};
