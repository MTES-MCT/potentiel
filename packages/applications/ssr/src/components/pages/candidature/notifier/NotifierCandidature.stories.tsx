import type { Meta, StoryObj } from '@storybook/react';

import { NotifierCandidaturesPage } from './NotifierCandidatures.page';

const meta = {
  title: 'Pages/Candidature/Notifier/NotifierCandidaturesPage',
  component: NotifierCandidaturesPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appelOffres: [{ id: '1', nom: "Appel d'offre 1", périodes: [{ id: '1', nom: 'Période 1' }] }],
  },
};
