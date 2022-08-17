import React from 'react'
import { Dropdown } from './Dropdown'

export default {
  title: 'Components/Atoms/Dropdown',
  component: Dropdown,
  argTypes: {
    children: { control: 'text', defaultValue: 'linkStory' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    design: { control: { type: 'radio' }, options: ['link', 'button'] },
    isOpen: { control: 'boolean' },
    changeOpenState: { control: 'action' },
  },
}

const Template = (args) => <Dropdown {...args} />

export const Default = Template.bind({})
Default.args = {
  isOpen: false,
  disabled: false,
  design: 'link',
  children: `contenu à afficher dans le dropdown`,
  text: 'Ceci est le titre du dropdown',
}
