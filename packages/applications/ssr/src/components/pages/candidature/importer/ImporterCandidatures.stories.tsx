import type { Meta, StoryObj } from '@storybook/react';

import { ImporterCandidaturesPage } from './ImporterCandidatures.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Candidature/Importer/ImporterCandidaturesPage',
  component: ImporterCandidaturesPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
