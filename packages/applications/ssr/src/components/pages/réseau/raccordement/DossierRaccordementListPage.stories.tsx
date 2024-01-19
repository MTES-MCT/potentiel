import type { Meta, StoryObj } from '@storybook/react';

import { DossierRaccordementListPage } from './DossierRaccordementListPage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/DossierRaccordementListPage',
  component: DossierRaccordementListPage,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    list: {},
  },
} satisfies Meta<typeof DossierRaccordementListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
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
