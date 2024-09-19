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
  required,
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
        aria-required
        disabled={disabled}
        className={className}
      />
      <LabelDescription>Taille maximale du fichier : 50 MB</LabelDescription>
    </div>
  );
};
