import React from 'react'
import { InfoBox } from './InfoBox'

export default {
  title: 'Components/Molecules/InfoBox',
  component: InfoBox,
  argTypes: {
    title: { control: 'text', defaultValue: 'titre' },
    children: { control: 'text', defaultValue: 'linkStory' },
  },
}

const Template = (args) => <InfoBox {...args} />

export const Default = Template.bind({})
Default.args = {
  title: `Exemple de titre d'une InfoBox`,
  children: `Exemple de description d'une InfoBox`,
}
