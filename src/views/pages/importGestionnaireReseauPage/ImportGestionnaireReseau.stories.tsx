import React from 'react'
import { ImportGestionnaireReseau } from '.'

export default { title: 'Pages/Import gestionnaire de réseau' }

export const Default = () => (
  <ImportGestionnaireReseau
    request={{} as any}
    tâches={[
      {
        id: '',
        type: 'maj-date-mise-en-service',
        date: new Date(),
        état: 'en cours',
      },
      {
        id: '',
        type: 'maj-date-mise-en-service',
        date: new Date(),
        état: 'terminée',
        résultat: { succès: 12, échec: 0 },
      },
      {
        id: '',
        type: 'maj-date-mise-en-service',
        date: new Date(),
        état: 'terminée',
        résultat: { succès: 12, échec: 3 },
      },
    ]}
  />
)
