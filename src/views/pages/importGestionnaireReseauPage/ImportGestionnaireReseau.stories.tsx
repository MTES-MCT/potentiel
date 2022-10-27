import React from 'react'
import { ImportGestionnaireReseau } from '.'

export default { title: 'Pages/Import gestionnaire de réseau' }

export const Default = () => (
  <ImportGestionnaireReseau
    request={{} as any}
    tâches={[
      {
        type: 'maj-date-mise-en-service',
        état: 'en cours',
        dateDeDébut: new Date(),
      },
      {
        type: 'maj-date-mise-en-service',
        état: 'terminée',
        dateDeDébut: new Date(),
        dateDeFin: new Date(),
        nombreDEchecs: 0,
        nombreDeSucces: 12,
        résultatErreurs: [
          {
            identifiantGestionnaireRéseau: 'idGR01',
            raison: 'Plusieurs projets pour un gesitonnaire de réseau',
          },
          {
            identifiantGestionnaireRéseau: 'idGR02',
            projetId: 'idprojet',
            raison: "La date est plus récente que l'actuelle",
          },
        ],
      },
      {
        type: 'maj-date-mise-en-service',
        état: 'terminée',
        dateDeDébut: new Date(),
        dateDeFin: new Date(),
        nombreDEchecs: 3,
        nombreDeSucces: 12,
        résultatErreurs: [
          {
            identifiantGestionnaireRéseau: 'idGR01',
            raison: 'Plusieurs projets pour un gesitonnaire de réseau',
          },
          {
            identifiantGestionnaireRéseau: 'idGR02',
            projetId: 'idprojet',
            raison: "La date est plus récente que l'actuelle",
          },
        ],
      },
    ]}
  />
)
