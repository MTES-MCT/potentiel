import { String } from 'aws-sdk/clients/cloudwatchevents'
import React, { useState } from 'react'
import { Tab } from './Tab'
import { Tabs } from './Tabs'

type GarantiesFinancieresFilterProps = {
  defaultValue: string
  onChange: (value: String) => void
}

export const GarantiesFinancieresFilter = (props: GarantiesFinancieresFilterProps) => {
  const { defaultValue = '', onChange } = props
  const [selectedValue, selectValue] = useState(defaultValue)

  const handleTabsOnSelect = (newValue: string): void => {
    selectValue(newValue)
    onChange(newValue)
  }

  return (
    <Tabs name="garantiesFinancieres" activeKey={selectedValue} onSelect={handleTabsOnSelect}>
      <Tab tabKey="">Toutes</Tab>
      <Tab tabKey="submitted">Déposées</Tab>
      <Tab tabKey="notSubmitted">Non-déposées</Tab>
      <Tab tabKey="pastDue">En retard</Tab>
    </Tabs>
  )
}
