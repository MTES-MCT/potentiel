import React from 'react'

type FormulaireChampsObligatoireLégendeProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export const FormulaireChampsObligatoireLégende = ({
  className = '',
}: FormulaireChampsObligatoireLégendeProps) => (
  <div className={`text-red-500 ${className}`}>* champs obligatoires</div>
)
