import type { Meta, StoryObj } from '@storybook/react';

import {
  ImporterCandidaturesPage,
  ImporterCandidaturesPageProps,
} from './ImporterCandidatures.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Candidature/Importer/ImporterCandidaturesPage',
  component: ImporterCandidaturesPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ImporterCandidaturesPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appelOffres: [{ id: '1', nom: "Appel d'offre 1", période: [{ id: '1', nom: 'Période 1' }] }],
  },
};
