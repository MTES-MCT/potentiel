import React from 'react'
import { ProjectDataForProjectPage } from '@modules/project'
import { NoteElement } from '../components'
import { ClipboardCheckIcon, Section } from '@components'

type ResultatsAppelOffreProps = {
  project: ProjectDataForProjectPage
}

export const ResultatsAppelOffre = ({ project }: ResultatsAppelOffreProps) => (
  <Section title="Résultats de l'appel d'offres" icon={ClipboardCheckIcon}>
    <div className="mb-3 text-lg">
      <b>Note totale</b>: {project.note || 'N/A'}
    </div>
    <ul>
      <NoteElement project={project} column={'Note prix'} />
      <NoteElement project={project} column={'Note innovation\n(AO innovation)'} />
      <ul>
        <NoteElement
          project={project}
          column={'Note degré d’innovation (/20pt)\n(AO innovation)'}
        />
        <NoteElement
          project={project}
          column={'Note positionnement sur le marché (/10pt)\n(AO innovation)'}
        />
        <NoteElement project={project} column={'Note qualité technique (/5pt)\n(AO innovation)'} />
        <NoteElement
          project={project}
          column={
            'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'
          }
        />
        <NoteElement
          project={project}
          column={'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'}
        />
      </ul>
    </ul>
  </Section>
)
