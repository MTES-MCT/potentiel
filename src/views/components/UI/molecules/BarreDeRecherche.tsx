import React, { FC } from 'react'
import { Button, Input, Label, SearchIcon } from '@components'

type BarreDeRechercheProps = {
  className?: string
  placeholder?: string
  defaultValue?: string
  name?: string
}

export const BarreDeRecherche: FC<BarreDeRechercheProps> = ({
  className = '',
  placeholder = 'Rechercher',
  defaultValue = '',
  name = 'champ-recherche',
}) => (
  <div className={`flex ${className}`}>
    <Label className="hidden" htmlFor={name}>
      Recherche
    </Label>
    <Input
      placeholder={placeholder}
      type="search"
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="leading-none px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base focus:border-b-blue-france-sun-base placeholder:italic"
    />
    <Button
      type="submit"
      title={placeholder}
      className="flex items-center py-2 px-2 lg:px-6 border-0 bg-blue-france-sun-base hover:bg-blue-france-sun-hover text-white"
    >
      <SearchIcon className="w-6 h-6 lg:mr-2" />
      <span className="hidden lg:block text-lg font-medium">Rechercher</span>
    </Button>
  </div>
)
