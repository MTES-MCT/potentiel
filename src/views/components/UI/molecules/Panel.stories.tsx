import React from 'react'
import { Panel } from './Panel'
import { CalendarIcon } from '../atoms/icons'

export default {
  title: 'Components/Molecules/Panel',
  component: Panel,
  argTypes: {
    icon: {
      control: { type: null },
    },
  },
}

const Template = (args) => <Panel {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Titre de mon panel',
  icon: CalendarIcon,
  children: `Ceci est un exemple de contenu possible dans un pannel`,
}
