import React, { ComponentProps, FC } from 'react'
import { Button, Input, Label, SearchIcon } from '@components'

type InputSearchProps = ComponentProps<'input'>
export const BarreDeRecherche: FC<InputSearchProps> = ({
  className = '',
  placeholder = 'Rechercher',
  defaultValue,
  name = 'champ-recherche',
  disabled,
  ...props
}) => (
  <div
    className={`flex  ${className}`}
    style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    {...props}
  >
    <Label className="hidden" htmlFor={name}>
      Recherche
    </Label>
    <Input
      placeholder={placeholder}
      type="search"
      id={name}
      name={name}
      disabled={disabled || false}
      defaultValue={defaultValue || ''}
      className="leading-none px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base focus:border-b-blue-france-sun-base placeholder:italic"
    />
    <Button
      type="submit"
      title={placeholder}
      disabled={disabled || false}
      className="flex items-center py-2 px-2 lg:px-6 border-0 bg-blue-france-sun-base hover:bg-blue-france-sun-hover text-white"
    >
      <SearchIcon className="w-6 h-6 lg:mr-2" />
      <span className="hidden lg:block text-lg font-medium">Rechercher</span>
    </Button>
  </div>
)
