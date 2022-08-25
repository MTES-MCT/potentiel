import React from 'react'
import { SecondaryButton } from './SecondaryButton'

export default {
  title: 'Components/Atoms/SecondaryButton',
  component: SecondaryButton,
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
  },
}

const Template = (args) => <SecondaryButton {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Exemple de bouton secondaire`,
  href: '#',
}
