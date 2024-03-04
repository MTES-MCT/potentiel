import type { Meta, StoryObj } from '@storybook/react';

import { Timeline, TimelineProps } from './Timeline';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Organisms/Timeline',
  component: Timeline,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TimelineProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        date: '01/01/2024',
        title: 'Ceci est un exemple de titre',
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'info',
        date: '02/01/2024',
        title: "Ceci est un exemple de titre avec un statut 'info'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'warning',
        date: '03/01/2024',
        title: "Ceci est un exemple de titre avec un statut 'warning'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'success',
        date: '04/01/2024',
        title: "Ceci est un exemple de titre avec un statut 'success'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'error',
        date: '05/01/2024',
        title: "Ceci est un exemple de titre avec un statut 'error'",
        content: 'Ceci est un exemple de contenu',
      },
    ],
  },
};
