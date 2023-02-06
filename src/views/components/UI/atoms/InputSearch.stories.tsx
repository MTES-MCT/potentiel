import React from 'react'
import { InputSearch } from './InputSearch'

export default {
  title: 'Components/Atoms/Inputs/Search',
  component: InputSearch,
  argTypes: {
    placeholder: { control: 'text' },
  },
}

const Template = (args) => <InputSearch {...args} />

export const Default = Template.bind({})

Default.args = {
  placeholder: 'Rechercher',
}
