import type { Meta, StoryObj } from '@storybook/react';

import { DemanderAbandonPage, DemanderAbandonPageProps } from './DemanderAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Demander/DemanderAbandonPage',
  component: DemanderAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DemanderAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projet: {
      identifiantProjet: 'identifiantProjet#1',
    },
    showRecandidatureCheckBox: true,
  },
};
