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
        appelOffre: 'identifiantAppelOffre1',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre1',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre1',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre2',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre2',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre2',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre2',
        période: 'identifiantPériode1',
      },
      {
        appelOffre: 'identifiantAppelOffre3',
        période: 'identifiantPériode1',
      },
    ],
  },
};
