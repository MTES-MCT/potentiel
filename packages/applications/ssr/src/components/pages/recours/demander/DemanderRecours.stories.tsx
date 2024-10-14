import type { Meta, StoryObj } from '@storybook/react';

import { DemanderRecoursPage, DemanderRecoursPageProps } from './DemanderRecours.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Recours/Demander/DemanderRecoursPage',
  component: DemanderRecoursPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DemanderRecoursPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
