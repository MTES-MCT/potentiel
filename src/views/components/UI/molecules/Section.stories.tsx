import React from 'react'
import { Section } from './Section'
import { CalendarIcon } from '../atoms/icons'

export default {
  title: 'Components/Molecules/Section',
  component: Section,
  argTypes: {
    icon: {
      control: { type: null },
    },
  },
}

const Template = (args) => <Section {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Titre de ma section',
  icon: CalendarIcon,
  children: `Ceci est un exemple de contenu possible dans une section`,
}
