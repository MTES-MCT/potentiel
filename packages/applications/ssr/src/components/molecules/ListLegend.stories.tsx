import type { Meta, StoryObj } from '@storybook/react';

import { ListLegend, ListLegendProps } from './ListLegend';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/List/Legend',
  component: ListLegend,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ListLegendProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    symbols: [
      {
        iconId: 'fr-icon-map-pin-2-line',
        description: 'Ceci est un exemple de description',
      },
      {
        iconId: 'fr-icon-community-line',
        description: 'Ceci est un exemple de description',
      },
      {
        iconId: 'fr-icon-user-line',
        description: 'Ceci est un exemple de description',
      },
      {
        iconId: 'fr-icon-lightbulb-line',
        description: 'Ceci est un exemple de description',
      },
      {
        iconId: 'fr-icon-money-euro-circle-line',
        description: 'Ceci est un exemple de description',
      },
      {
        iconId: 'fr-icon-cloudy-2-line',
        description: 'Ceci est un exemple de description',
      },
    ],
  },
};
