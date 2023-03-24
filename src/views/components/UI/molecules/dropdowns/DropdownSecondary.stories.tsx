import React from 'react';
import { DropdownSecondary } from './DropdownSecondary';

export default {
  title: 'Components/Molecules/dropdowns/DropdownSecondary',
  component: DropdownSecondary,
  argTypes: {
    children: { control: 'text', defaultValue: 'DropdownSecondary' },
  },
};

const Template = (args: Parameters<typeof DropdownSecondary>[0]) => (
  <DropdownSecondary className="inline-flex" {...args} />
);

export const Default = Template.bind({});
Default.args = {
  titre: `Exemple de DropdownSecondary`,
  children: (
    <>
      <DropdownSecondary.DropdownItem href="#">Lien 1</DropdownSecondary.DropdownItem>
      <DropdownSecondary.DropdownItem href="#">Lien 2</DropdownSecondary.DropdownItem>
    </>
  ),
} as Parameters<typeof DropdownSecondary>[0];
