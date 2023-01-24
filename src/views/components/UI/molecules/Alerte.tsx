import React, { ComponentProps, FC } from 'react'
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../atoms'

type TypesAlerte = 'Erreur' | 'Succès' | 'Information' | 'Attention'

type AlerteProps = ComponentProps<'div'> & {
  type: TypesAlerte
  title?: string
}

type PictoAlerteProps = ComponentProps<'svg'> & {
  type: TypesAlerte
}

const PictoAlerte: FC<PictoAlerteProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'Erreur':
      return <ErrorIcon {...{ className }} />
    case 'Succès':
      return <SuccessIcon {...{ className }} />
    case 'Information':
      return <InfoIcon {...{ className }} />
    case 'Attention':
      return <WarningIcon {...{ className }} />
  }
}

const couleurs: Record<TypesAlerte, { backgroundColor: string; borderColor: string }> = {
  Attention: {
    backgroundColor: 'bg-warning-425-base',
    borderColor: 'border-warning-425-base',
  },
  Erreur: {
    backgroundColor: 'bg-error-425-base',
    borderColor: 'border-error-425-base',
  },
  Information: {
    backgroundColor: 'bg-info-425-base',
    borderColor: 'border-info-425-base',
  },
  Succès: {
    backgroundColor: 'bg-success-425-base',
    borderColor: 'border-success-425-base',
  },
}

export const Alerte: FC<AlerteProps> = ({
  type,
  title,
  children,
  className = '',
  ...props
}: AlerteProps) => {
  const { backgroundColor, borderColor } = couleurs[type]

  return (
    <div className={`${className}`} {...props}>
      <div className={`flex border-solid border-[1px] border-l-0 ${borderColor}`}>
        <div className={backgroundColor}>
          <PictoAlerte type={type} className="text-white text-2xl mx-2 mt-4" />
        </div>
        <div className={`pl-5 pr-8 pt-4 pb-3`}>
          {title && <div className="text-xl font-semibold mb-1">{title}</div>}
          {children}
        </div>
      </div>
    </div>
  )
}
