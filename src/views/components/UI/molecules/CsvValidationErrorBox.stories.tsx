import React from 'react'
import { CsvValidationErrorBox } from './CsvValidationErrorBox'

const defaultValue = {
  validationErreurs: [
    {
      numéroLigne: 2,
      valeur: 'originalValue1',
      erreur: 'Le champ est incorrect car X',
    },
    {
      numéroLigne: 3,
      erreur: 'Le champ est manquant',
    },
    {
      valeur: 'originalValue2',
      erreur: 'Une erreur est survenue',
    },
    {
      valeur: undefined,
      erreur: 'Une erreur est survenue',
    },
  ],
}

export default {
  title: 'Components/Molecules/CsvValidationErrorBox',
  component: CsvValidationErrorBox,
  argTypes: {
    validationErreurs: {
      control: 'object',
      defaultValue,
    },
  },
}

const Template = (args) => <CsvValidationErrorBox {...args} />

export const Default = Template.bind({})
Default.args = {
  defaultValue,
}
