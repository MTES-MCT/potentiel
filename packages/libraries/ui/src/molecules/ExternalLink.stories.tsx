import { Meta, StoryObj } from '@storybook/react';
import { ExternalLink } from './ExternalLink';

const meta: Meta<typeof ExternalLink> = {
  title: 'Molecules/ExternalLink',
  component: ExternalLink,
};
export default meta;

type Story = StoryObj<typeof ExternalLink>;

export const Primary: Story = {
  args: {
    children: `Exemple de lien externe `,
    href: 'https://potentiel.beta.gouv.fr/',
  },
};
