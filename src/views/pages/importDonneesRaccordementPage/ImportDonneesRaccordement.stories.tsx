import React from 'react'
import { ImportDonneesRaccordement } from '.'

export default { title: 'Pages/Import gestionnaire de réseau' }

export const Default = () => (
  <ImportDonneesRaccordement
    request={{} as any}
    tâches={[
      {
        type: 'maj-données-de-raccordement',
        état: 'en cours',
        dateDeDébut: new Date(),
      },
      {
        type: 'maj-données-de-raccordement',
        état: 'terminée',
        dateDeDébut: new Date(),
        dateDeFin: new Date(),
        détail: {
          erreurs: [
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
      },
      {
        type: 'maj-données-de-raccordement',
        état: 'terminée',
        dateDeDébut: new Date(),
        dateDeFin: new Date(),
        détail: {
          succès: [
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
            },
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
            },
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
            },
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
            },
          ],
          ignorés: [
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
              raison: "La date est plus récente que l'actuelle",
            },
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
              raison: "La date est plus récente que l'actuelle",
            },
            {
              identifiantGestionnaireRéseau: 'idGR02',
              projetId: 'idprojet',
              raison: "La date est plus récente que l'actuelle",
            },
          ],
          erreurs: [
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
      },
    ]}
  />
)
