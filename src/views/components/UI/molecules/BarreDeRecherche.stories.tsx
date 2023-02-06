import React from 'react'
import { BarreDeRecherche } from './BarreDeRecherche'

export default {
  title: 'Components/Molecules/BarreDeRecherche',
  component: BarreDeRecherche,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { controle: 'boolean' },
  },
}

const Template = (args) => <BarreDeRecherche {...args} />

export const Default = Template.bind({})

Default.args = {
  placeholder: 'Rechercher',
  disabled: false,
}
