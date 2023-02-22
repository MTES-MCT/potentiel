import React, { ComponentProps, FC } from 'react'
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../../atoms'

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
      return <ErrorIcon {...{ className }} title="Information erreur" />
    case 'Succès':
      return <SuccessIcon {...{ className }} title="Information succès" />
    case 'Information':
      return <InfoIcon {...{ className }} title="Information" />
    case 'Attention':
      return <WarningIcon {...{ className }} title="Information alerte" />
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
  const petiteAlerte = !title

  return (
    <div className={`${className}`} {...props}>
      <div className={`flex border-solid border-[1px] border-l-0 ${borderColor}`}>
        <div className={backgroundColor}>
          <PictoAlerte
            type={type}
            className={`text-white text-2xl align-top ${petiteAlerte ? 'm-2' : 'mx-2 mt-4'}`}
          />
        </div>
        <div className={petiteAlerte ? 'pl-4 pr-9 pt-2 pb-1' : 'pl-5 pr-8 pt-4 pb-3'}>
          {title && <div className="text-xl font-semibold mb-1">{title}</div>}
          {children}
        </div>
      </div>
    </div>
  )
}
