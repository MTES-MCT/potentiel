import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Organisms/Pagination',
  component: Pagination,
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Primary: Story = {
  args: {
    pageCount: 5,
    currentPage: 1,
    currentUrl: 'http://localhost:3000/projets.html',
  },
};
