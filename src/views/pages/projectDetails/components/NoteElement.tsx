import React from 'react'

interface NoteElementProps {
  project: {
    details: Record<string, any>
  }
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
