import React from 'react'
import { Input } from './Input'
import { InputCheckbox } from './InputCheckbox'

export default {
  title: 'Components/Atoms/Inputs',
  components: { InputCheckbox, Input },
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

const InputCheckboxTemplate = (args) => <InputCheckbox {...args} />
export const Checkbox = InputCheckboxTemplate.bind({})
Checkbox.args = {
  disabled: false,
}

const InputTemplate = (args) => <Input {...args} />
export const Text = InputTemplate.bind({})
Text.args = {
  placeholder: 'Ceci est un input text',
}
