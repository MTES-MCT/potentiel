import React from 'react'
import { Alerte } from './Alerte'

export default {
  title: 'Components/Molecules/Alerte',
  component: Alerte,
  argTypes: {
    type: { options: ['Attention', 'Erreur', 'Information', 'Succès'] },
    title: { control: 'text', defaultValue: 'titre' },
    children: { control: 'text', defaultValue: '-' },
  },
}

const Template = (args) => <Alerte {...args} />

export const Default = Template.bind({})
Default.args = {
  type: 'Attention',
  title: `Exemple de titre d'une Alerte`,
  children: `Exemple de description d'une Alerte`,
}
