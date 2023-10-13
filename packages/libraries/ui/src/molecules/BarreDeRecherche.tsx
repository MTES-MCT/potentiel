import React, { FC } from 'react';
import { PrimaryButton } from './Buttons';
import { Input, Label, SearchIcon } from '../atoms';

type BarreDeRechercheProps = {
  className?: string;
  defaultValue?: string;
  name: string;
  placeholder?: string;
};

export const BarreDeRecherche: FC<BarreDeRechercheProps> = ({
  className = '',
  placeholder = 'Rechercher',
  defaultValue = '',
  name,
}) => (
  <div className={`flex flex-col ${className}`}>
    <Label htmlFor={name} className="collapse">
      {placeholder}
    </Label>
    <div className="flex">
      <Input
        placeholder={placeholder}
        type="search"
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="leading-none !mt-0 px-4 pt-2 pb-[5px] rounded-t-[4px] rounded-tr-[4px] rounded-b-none rounded-bl-none border-0 border-b-[3px] border-b-blue-france-sun-base focus:border-b-blue-france-sun-base placeholder:italic"
      />
      <PrimaryButton
        type="submit"
        title={placeholder}
        className="flex items-center py-2 px-2 lg:px-6 border-0 bg-blue-france-sun-base hover:bg-blue-france-sun-hover text-white"
      >
        <SearchIcon className="w-6 h-6 lg:mr-2" aria-hidden />
      </PrimaryButton>
    </div>
  </div>
);
