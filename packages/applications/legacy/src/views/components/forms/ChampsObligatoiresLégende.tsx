import React from 'react';

type ChampsObligatoiresLégendeProps = React.HTMLAttributes<HTMLDivElement>;

export const ChampsObligatoiresLégende = (props: ChampsObligatoiresLégendeProps) => (
  <div {...props} className={`text-sm italic ${props.className || ''}`}>
    Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
  </div>
);
