import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Accordeon } from './Accordeon';

const meta: Meta<typeof Accordeon> = {
  title: 'Molecules/Accordeon',
  component: Accordeon,
};
export default meta;

type Story = StoryObj<typeof Accordeon>;

export const Primary: Story = {
  args: {
    title: `Exemple d'accordéon`,
    children: (
      <>
        <h2>Contenu</h2>
        <p>Exemple de contenu</p>
      </>
    ),
  } as Parameters<typeof Accordeon>[0],
};
