import React from 'react'
import { Callout } from './Callout'

export default {
  title: 'Components/Atoms/Callout',
  component: Callout,
  argTypes: {
    children: { control: 'text' },
  },
}

const Template = (args) => <Callout {...args} />

export const Default = Template.bind({})

Default.args = {
  children: `Exemple de callout`,
}
