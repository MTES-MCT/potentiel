import React from 'react'
import { InputCheckbox } from './InputCheckbox'

export default {
  title: 'Components/Atoms/Inputs/Checkbox',
  component: InputCheckbox,
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

const Template = (args) => <InputCheckbox {...args} />

export const Default = Template.bind({})

Default.args = {
  disabled: false,
}
