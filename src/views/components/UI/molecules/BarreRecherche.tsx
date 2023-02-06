import React, { ComponentProps, FC } from 'react'
import { SearchIcon } from '@components'

type InputSearchProps = ComponentProps<'input'>
export const BarreRecherche: FC<InputSearchProps> = ({
  className = '',
  placeholder = 'Rechercher',
  defaultValue,
  name = 'champ-recherche',
  ...props
}) => (
  <div
    className={`flex  ${className}`}
    style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    {...props}
  >
    <label className="hidden" htmlFor={name}>
      Recherche
    </label>
    <input
      placeholder={placeholder}
      type="search"
      id={name}
      name={name}
      defaultValue={defaultValue || ''}
      className="leading-none px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base focus:border-b-blue-france-sun-base bg-grey-950-base placeholder:italic"
    />
    <button
      type="submit"
      title={placeholder}
      className="flex items-center py-2 px-2 lg:px-6 border-0 bg-blue-france-sun-base hover:bg-blue-france-sun-hover text-white"
    >
      <SearchIcon className="w-6 h-6 lg:mr-2" />
      <span className="hidden lg:block text-lg font-medium">Rechercher</span>
    </button>
  </div>
)
