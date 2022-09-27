import React from 'react'
import { RichRadio } from './RichRadio'

export default {
  title: 'Components/Atoms/RichRadio',
  component: RichRadio,
  argTypes: {
    children: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

const Template = (args) => <RichRadio id="bouton-radio-riche" {...args} />

export const Default = Template.bind({})

Default.args = {
  children: `Exemple de bouton radio riche`,
  checked: true,
  disabled: false,
}
