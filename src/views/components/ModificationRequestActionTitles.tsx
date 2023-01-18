import React from 'react'

export const ModificationRequestActionTitles = ({ action }) => {
  const titlePerAction = {
    delai: 'Je demande un délai supplémentaire',
    actionnaire: "Je signale un changement d'actionnaire",
    fournisseur: 'Je signale un changement de fournisseur',
    puissance: 'Je signale un changement de puissance',
    producteur: 'Je signale un changement de producteur',
    abandon: 'Je demande un abandon de mon projet',
    recours: 'Je demande un recours',
    'annulation abandon': "Je demande une annulation d'abandon de mon projet",
  }
  return <span>{titlePerAction[action]}</span>
}
