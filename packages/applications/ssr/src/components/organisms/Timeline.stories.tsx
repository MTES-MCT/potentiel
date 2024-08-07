import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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
        date: 'En attente',
        title: 'Ceci est un exemple de titre',
        content: 'Ceci est un exemple de contenu',
      },
      {
        date: 'En attente',
        title: 'Ceci est un exemple de titre',
        content: 'Ceci est un exemple de contenu',
      },
      {
        date: new Date('01/01/2024').toISOString() as Iso8601DateTime,
        title: 'Ceci est un exemple de titre',
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'info',
        date: new Date('02/01/2024').toISOString() as Iso8601DateTime,
        title: "Ceci est un exemple de titre avec un statut 'info'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'warning',
        date: new Date('03/01/2024').toISOString() as Iso8601DateTime,
        title: "Ceci est un exemple de titre avec un statut 'warning'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'success',
        date: new Date('04/01/2024').toISOString() as Iso8601DateTime,
        title: "Ceci est un exemple de titre avec un statut 'success'",
        content: 'Ceci est un exemple de contenu',
      },
      {
        status: 'error',
        date: new Date('05/01/2024').toISOString() as Iso8601DateTime,
        title: "Ceci est un exemple de titre avec un statut 'error'",
        content: 'Ceci est un exemple de contenu',
      },
    ],
  },
};
