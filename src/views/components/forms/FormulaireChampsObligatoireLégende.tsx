import React from 'react';

type FormulaireChampsObligatoireLégendeProps = React.HTMLAttributes<HTMLDivElement>;

export const FormulaireChampsObligatoireLégende = (
  props: FormulaireChampsObligatoireLégendeProps,
) => (
  <div {...props} className={`text-error-425-base ${props.className || ''}`}>
    * champs obligatoires
  </div>
);
