import type { Meta, StoryObj } from '@storybook/react';

import {
  ProjetADéjàUnDépôtEnCoursPage,
  ProjetADéjàUnDépôtEnCoursProps,
} from './ProjetADéjàUnDépôtEnCours.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Soumettre',
  component: ProjetADéjàUnDépôtEnCoursPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ProjetADéjàUnDépôtEnCoursProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjetADéjàUnDépôtEnCoursExistant: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
