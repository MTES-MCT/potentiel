import React from 'react';

type FormulaireChampsObligatoireLégendeProps = React.HTMLAttributes<HTMLDivElement>;

export const FormulaireChampsObligatoireLégende = (
  props: FormulaireChampsObligatoireLégendeProps,
) => (
  <div {...props} className={`text-error-425-base italic ${props.className || ''}`}>
    * champs obligatoires
  </div>
);
