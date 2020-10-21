import React from 'react'
import { Project } from '../../../../entities'

interface NoteElementProps {
  project: Project
  column: string
}
export const NoteElement = ({ project, column }: NoteElementProps) => {
  let noteStr: string = project.details && project.details[column]

  if (noteStr) {
    const note = parseFloat(noteStr.replace(',', '.'))

    if (!Number.isNaN(note)) {
      noteStr = (Math.round(note * 100) / 100).toString()
    } else noteStr = 'N/A'
  }

  return (
    <li>
      <b>{column.replace('\n(AO innovation)', '')}</b>: {noteStr || 'N/A'}
    </li>
  )
}