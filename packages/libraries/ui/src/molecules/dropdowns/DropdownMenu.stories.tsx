import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Primary: Story = {
  args: {
    buttonChildren: `Exemple de menu déroulant`,
    children: (
      <>
        <DropdownMenu.DropdownItem href="#">Menu 1</DropdownMenu.DropdownItem>
        <DropdownMenu.DropdownItem href="#">Menu 2</DropdownMenu.DropdownItem>
      </>
    ),
  } as Parameters<typeof DropdownMenu>[0],
};
