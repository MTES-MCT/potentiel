import type { Meta, StoryObj } from '@storybook/react';

import { NotifierPériodePage } from './NotifierPériode.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Période/NotifierPage',
  component: NotifierPériodePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appelOffres: [
      {
        identifiantAppelOffre: 'identifiantAppelOffre1',
        libellé: "Appel d'offres 1",
        périodes: [
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 1 - Période 1`,
          },
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 1 - Période 2`,
          },
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 1 - Période 3`,
          },
        ],
      },
      {
        identifiantAppelOffre: 'identifiantAppelOffre2',
        libellé: "Appel d'offres 2",
        périodes: [
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 2 - Période 1`,
          },
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 2 - Période 2`,
          },
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 2 - Période 3`,
          },
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 2 - Période 4`,
          },
        ],
      },
      {
        identifiantAppelOffre: 'identifiantAppelOffre3',
        libellé: "Appel d'offres 3",
        périodes: [
          {
            identifiantPériode: 'identifiantPériode1',
            libellé: `Appel d'offres 3 - Période 1`,
          },
        ],
      },
    ],
  },
};
