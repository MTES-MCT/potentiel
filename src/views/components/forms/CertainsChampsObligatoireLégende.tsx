import React from 'react';

type CertainsChampsObligatoireLégendeProps = React.HTMLAttributes<HTMLDivElement>;

export const CertainsChampsObligatoireLégende = (props: CertainsChampsObligatoireLégendeProps) => (
  <div {...props} className={`text-error-425-base italic ${props.className || ''}`}>
    * champs obligatoires
  </div>
);
