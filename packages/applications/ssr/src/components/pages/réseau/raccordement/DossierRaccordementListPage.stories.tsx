import type { Meta, StoryObj } from '@storybook/react';

import { DossierRaccordementListPage } from './DossierRaccordementListPage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/DossierRaccordementListPage',
  component: DossierRaccordementListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<typeof DossierRaccordementListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  args: {
    list: {
      currentPage: 1,
      items: [],
      itemsPerPage: 10,
      totalItems: 10,
    },
  },
};
