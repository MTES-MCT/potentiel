import React from 'react';
import { Input, LabelDescription } from '../atoms';

type InputFileProps = {
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export const InputFile = ({
  id = 'file',
  name = 'file',
  required = true,
  disabled,
  className,
}: InputFileProps) => {
  return (
    <div>
      <Input
        type="file"
        name={name}
        id={id}
        required={required}
        aria-required={required}
        disabled={disabled}
        className={className}
      />
      <LabelDescription className="italic">Taille maximale du fichier : 25 Mo</LabelDescription>
    </div>
  );
};
