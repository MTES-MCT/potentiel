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
    périodes: [
      {
        appelOffre: 'PPE2 - Fusion',
        période: '1',
      },
      {
        appelOffre: 'PPE2 - Fusion',
        période: '2',
      },
      {
        appelOffre: 'PPE2 - Fusion',
        période: '3',
      },
      {
        appelOffre: 'PPE2 - Vapeur',
        période: '1',
      },
      {
        appelOffre: 'PPE2 - Vapeur',
        période: '2',
      },
      {
        appelOffre: 'PPE2 - Vapeur',
        période: '3',
      },
      {
        appelOffre: 'PPE2 - Vapeur',
        période: '4',
      },
      {
        appelOffre: 'CRE4 - Charbon',
        période: '1',
      },
    ],
  },
};
