import React from 'react'
import { BarreRecherche } from './BarreRecherche'

export default {
  title: 'Components/Molecules/BarreRecherche',
  component: BarreRecherche,
  argTypes: {
    placeholder: { control: 'text' },
  },
}

const Template = (args) => <BarreRecherche {...args} />

export const Default = Template.bind({})

Default.args = {
  placeholder: 'Rechercher',
}
