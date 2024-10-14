import type { Meta, StoryObj } from '@storybook/react';

import { ProjetBanner, ProjetBannerProps } from './ProjetBanner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/Projet/ProjetBanner',
  component: ProjetBanner,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="bg-blue-france-sun-base text-theme-white py-6 mb-3">
        <div className="fr-container">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<ProjetBannerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
  },
};
