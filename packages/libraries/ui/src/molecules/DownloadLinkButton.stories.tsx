import { Meta, StoryObj } from '@storybook/react';
import { DownloadLinkButton } from './DownloadLinkButton';

const meta: Meta<typeof DownloadLinkButton> = {
  title: 'Molecules/DownloadLinkButton',
  component: DownloadLinkButton,
};
export default meta;

type Story = StoryObj<typeof DownloadLinkButton>;

export const Primary: Story = {
  args: {
    children: `Exemple de lien de téléchargement`,
    fileUrl: '#',
  },
};
