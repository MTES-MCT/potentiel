import React from 'react'

const ColorByStatus: Record<ProjectStatusLabelProps['status'], string> = {
  lauréat: 'bg-green-700',
  éliminé: 'bg-red-700',
  abandonné: 'bg-yellow-400',
  'non-notifié': 'bg-blue-700',
}

const TitleByStatus: Record<ProjectStatusLabelProps['status'], string> = {
  lauréat: 'Actif',
  éliminé: 'Eliminé',
  abandonné: 'Abandonné',
  'non-notifié': 'Non notifié',
}

interface ProjectStatusLabelProps {
  status: 'lauréat' | 'éliminé' | 'abandonné' | 'non-notifié'
}
export const ProjectStatusLabel = ({ status }: ProjectStatusLabelProps) => (
  <div className={`rounded-md flex px-2 py-0.5 ml-2 ${ColorByStatus[status]}`}>
    <p className="text-xs font-bold tracking-wide uppercase text-white m-0">
      {TitleByStatus[status]}
    </p>
  </div>
)
