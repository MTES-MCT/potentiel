import type { Meta, StoryObj } from '@storybook/react';

import { ImporterDatesMiseEnServicePage } from './ImporterDatesMiseEnService.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/ImporterDatesMiseEnServicePage',
  component: ImporterDatesMiseEnServicePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: () => Promise.resolve({ status: 'success', result: { successCount: 1, errors: [] } }),
  },
};
