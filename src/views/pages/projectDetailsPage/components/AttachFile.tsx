import React, { useState } from 'react'
import { PaperClipIcon } from '@heroicons/react/outline'
import ROUTES from '../../../../routes'
import { DateInput } from '../../../components'

interface AttachFileProps {
  projectId: string
}
export const AttachFile = ({ projectId }: AttachFileProps) => {
  const [isFormVisible, setFormVisible] = useState(false)
  const [fileCount, setFileCount] = useState(1)

  return (
    <div>
      {!isFormVisible && (
        <button
          className="button-outline primary inline-block pl-1 grow whitespace-nowrap text-center lg:max-w-fit self-start"
          style={{
            marginTop: 0,
            marginRight: 0,
          }}
          onClick={() => setFormVisible(true)}
        >
          <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
          Attacher un fichier
        </button>
      )}
      {isFormVisible && (
        <form
          action={ROUTES.ATTACHER_FICHIER_AU_PROJET_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="date">Date d'effet (format JJ/MM/AAAA)</label>
            <DateInput onError={(isError) => {}} initialValue={new Date()} />
          </div>
          <div className="mt-2">
            <label htmlFor="title">Titre</label>
            <input type="text" name="title" id="title" required />
          </div>
          <div className="mt-2">
            <label htmlFor="description">Description (optionnelle)</label>
            <textarea name="description" id="description" />
          </div>
          <div className="mt-2">
            <label htmlFor="file">Fichier(s) à attacher</label>
            {Array.from({ length: fileCount }, (v, i) => i).map((i) => (
              <input key={`file_${i}`} type="file" name="file" id="file" />
            ))}
            <a onClick={() => setFileCount(fileCount + 1)}>+ Ajouter un autre fichier</a>
          </div>
          <div className="notification mt-3 mb-2">
            Ce fichier sera visible pour l'administration et le porteur de projet.
          </div>
          <button className="button" type="submit" name="submit" disabled={false}>
            Envoyer
          </button>
          <a
            onClick={() => {
              setFormVisible(false)
              setFileCount(1)
            }}
          >
            Annuler
          </a>
        </form>
      )}
    </div>
  )
}
