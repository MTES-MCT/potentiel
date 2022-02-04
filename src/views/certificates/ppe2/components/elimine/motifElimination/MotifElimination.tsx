import React from 'react'
import { ProjectDataForCertificate } from '@modules/project'
import { AuDessusDePcible } from './AuDessusDePcible'
import { AutreMotif } from './AutreMotif'
import { Competitivite } from './Competitivite'
import { DejaLaureatNonInstruit } from './DejaLaureatNonInstruit'

type MotifProps = {
  project: ProjectDataForCertificate
}

export const MotifElimination = ({ project }: MotifProps) => {
  const { motifsElimination } = project

  if (motifsElimination.includes('note obtenue')) {
    return <AuDessusDePcible {...{ project }} />
  }

  if (motifsElimination === 'Déjà lauréat - Non instruit') {
    return <DejaLaureatNonInstruit />
  }

  if (motifsElimination.includes('compétitivité')) {
    return <Competitivite {...{ project }} />
  }

  return <AutreMotif {...{ motifsElimination }} />
}
