import React from 'react';

type ToutLesChampsObligatoiresLégendeProps = React.HTMLAttributes<HTMLDivElement>;

export const ToutLesChampsObligatoiresLégende = (props: ToutLesChampsObligatoiresLégendeProps) => (
  <div {...props} className={`text-error-425-base italic ${props.className || ''}`}>
    Tous les champs sont obligatoires
  </div>
);
