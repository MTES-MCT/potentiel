import type { Meta, StoryObj } from '@storybook/react';

import { ListFilters, ListFiltersProps } from './ListFilters';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/List/Filters',
  component: ListFilters,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<ListFiltersProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: [
      {
        label: 'filter label 1',
        options: [
          {
            label: 'option label 1',
            value: 'option value 1',
          },
          {
            label: 'option label 2',
            value: 'option value 2',
          },
          {
            label: 'option label 3',
            value: 'option value 3',
          },
        ],
        searchParamKey: 'searchParamKey',
      },
    ],
  },
};
