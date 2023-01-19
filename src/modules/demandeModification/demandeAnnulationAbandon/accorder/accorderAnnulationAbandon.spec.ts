import { statutsDemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'

describe(`Accorder une annulation d'abandon de projet`, () => {
  describe(`Cas d'un projet qui n'est pas abandonné`, () => {
    it(`Etant donné un projet non abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible car le projet n'est pas abandonné`, () => {
      //...
    })
  })

  describe(`Cas d'une demande qui n'est pas en statut "envoyée"`, () => {
    for (const statut of statutsDemandeAnnulationAbandon.filter((statut) => statut !== 'envoyée')) {
      it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut ${statut},
        alors il devrait être notifié que l'action est impossible en raison du statut incompatible de la demande`, () => {
        //...
      })
    }
  })

  describe(`Cas d'un CDC incompatible avec une annulation d'abandon`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        mais que le CDC actuel du projet ne prévoit pas d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible en raison du CDC incompatible`, () => {
      //...
    })
  })

  describe(`Conditions d'acceptation réunies`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        et que le CDC actuel du projet prévoit l'annulation d'abandon,
        alors la demande devrait être accordée`, () => {
      //...
    })
  })
})
