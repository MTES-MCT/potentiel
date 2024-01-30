import type { Meta, StoryObj } from '@storybook/react';

import { ImporterDatesMiseEnServicePage } from './ImporterDatesMiseEnServicePage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/ImporterDatesMiseEnServicePage',
  component: ImporterDatesMiseEnServicePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ImporterDatesMiseEnServicePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    csvErrors: [],
    résultatImport: [],
  },
};
