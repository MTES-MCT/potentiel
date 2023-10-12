import { Meta, StoryObj } from '@storybook/react';
import { DownloadLink } from './DownloadLink';

const meta: Meta<typeof DownloadLink> = {
  title: 'Molecules/DownloadLink',
  component: DownloadLink,
};
export default meta;

type Story = StoryObj<typeof DownloadLink>;

export const Primary: Story = {
  args: {
    children: `Exemple de lien de téléchargement`,
    fileUrl: '#',
  },
};
