import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { CalendarIcon } from '../atoms/icons';

const meta: Meta<typeof Section> = {
  title: 'Molecules/Section',
  component: Section,
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Primary: Story = {
  args: {
    title: 'Molecules/Titre de ma section',
    icon: <CalendarIcon />,
    children: `Ceci est un exemple de contenu possible dans une section`,
  },
};
