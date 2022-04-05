import React from 'react'
import { UploadLegacyModificationFiles } from '.'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

export default { title: 'Admin Attacher courrier' }

export const AvantEnvoi = () => (
  <UploadLegacyModificationFiles
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
  />
)

export const AprèsEnvoiToutBon = () => (
  <UploadLegacyModificationFiles
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    results={[
      {
        filename: 'test1.pdf',
        error: false,
      },
    ]}
  />
)

export const AprèsEnvoiToutKo = () => (
  <UploadLegacyModificationFiles
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    results={[
      {
        filename: 'test1.pdf',
        error: true,
        message: 'Pas de modification historique trouvée avec ce nom de fichier.',
      },
      {
        filename: 'test2.pdf',
        error: true,
        message: 'Impossible de sauvegarder le fichier',
      },
      {
        filename: 'test3.pdf',
        error: true,
        message: 'Plusieurs modifications historiques trouvées avec ce nom de fichier.',
      },
    ]}
  />
)

export const AprèsEnvoiPartiellementOk = () => (
  <UploadLegacyModificationFiles
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    results={[
      {
        filename: 'test1.pdf',
        error: true,
        message: 'Pas de modification historique trouvée avec ce nom de fichier.',
      },
      {
        filename: 'test2.pdf',
        error: true,
        message: 'Impossible de sauvegarder le fichier',
      },
      {
        filename: 'test3.pdf',
        error: false,
      },
      {
        filename: 'test3.pdf',
        error: false,
      },
      {
        filename: 'test3.pdf',
        error: false,
      },
    ]}
  />
)
