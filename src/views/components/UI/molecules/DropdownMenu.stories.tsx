import React from 'react'
import { DropdownMenu } from './DropdownMenu'

export default {
  title: 'Components/Molecules/DropdownMenu',
  component: DropdownMenu,
  argTypes: {
    children: { control: 'text', defaultValue: 'Menu' },
  },
}

const Template = (args: Parameters<typeof DropdownMenu>[0]) => (
  <DropdownMenu className="inline-flex" {...args} />
)

export const Default = Template.bind({})
Default.args = {
  buttonChildren: `Exemple de menu déroulant`,
  children: (
    <>
      <DropdownMenu.DropdownItem href="#">Menu 1</DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href="#">Menu 2</DropdownMenu.DropdownItem>
    </>
  ),
} as Parameters<typeof DropdownMenu>[0]
