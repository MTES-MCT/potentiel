import React from 'react'
import { BarreDeRecherche } from './BarreDeRecherche'

export default {
  title: 'Components/Molecules/BarreDeRecherche',
  component: BarreDeRecherche,
  argTypes: {
    placeholder: { control: 'text' },
  },
}

const Template = (args) => <BarreDeRecherche {...args} />

export const Default = Template.bind({})

Default.args = {
  placeholder: 'Rechercher',
}
