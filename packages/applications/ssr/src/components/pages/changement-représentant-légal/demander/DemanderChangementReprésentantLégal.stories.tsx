import type { Meta, StoryObj } from '@storybook/react';

import {
  DemanderChangementReprésentantLégalPage,
  DemanderChangementReprésentantLégalPageProps,
} from './DemanderChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ChangementReprésentantLégal/Demander/DemanderChangementReprésentantLégalPage',
  component: DemanderChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DemanderChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
