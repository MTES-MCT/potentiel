import React from 'react'

type FormulaireChampsObligatoireMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export const FormulaireChampsObligatoireMessage = ({
  className = '',
}: FormulaireChampsObligatoireMessageProps) => (
  <div className={`text-red-500 ${className}`}>* champs obligatoires</div>
)
