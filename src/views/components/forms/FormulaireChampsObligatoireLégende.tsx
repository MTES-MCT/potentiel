import React from 'react'

type FormulaireChampsObligatoireLégendeProps = React.HTMLAttributes<HTMLDivElement>

export const FormulaireChampsObligatoireLégende = (
  props: FormulaireChampsObligatoireLégendeProps
) => (
  <div {...props} className={`text-red-500 ${props.className || ''}`}>
    * champs obligatoires
  </div>
)
