import React, { useState } from 'react'
import { PaperClipIcon } from '@heroicons/react/outline'
import ROUTES from '@routes'
import { DateInput, Button, SecondaryButton } from '@components'

interface AttachFileProps {
  projectId: string
}
export const AttachFile = ({ projectId }: AttachFileProps) => {
  const [isFormVisible, setFormVisible] = useState(false)
  const [fileCount, setFileCount] = useState(1)

  return (
    <div>
      {!isFormVisible && (
        <SecondaryButton
          className="inline-block pl-1 grow whitespace-nowrap text-center lg:max-w-fit self-start m-0"
          onClick={() => setFormVisible(true)}
        >
          <PaperClipIcon className="h-5 w-5 align-middle mx-2" />
          Attacher un fichier
        </SecondaryButton>
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
          <div className="text-sm mt-4">
            Les fichiers attachés sont visibles de l'administration et du porteur de projet.
          </div>
          <Button className="mt-2 mr-2" type="submit" name="submit">
            Envoyer
          </Button>
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
