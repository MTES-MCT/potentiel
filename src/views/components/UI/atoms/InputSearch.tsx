import React, { ComponentProps, FC } from 'react'

type InputSearchProps = ComponentProps<'input'>

export const InputSearch: FC<InputSearchProps> = ({ className = '', ...props }) => {
  return (
    <>
      <label className="hidden" htmlFor="champ-recherche">
        Recherche
      </label>
      <input
        placeholder="Rechercher"
        type="search"
        id="champ-recherche"
        name="champ-recherche"
        className="leading-none px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base bg-grey-950-base placeholder:italic"
      />
      <button className="fr-btn" title="Rechercher">
        Rechercher
      </button>
    </>
  )
}
