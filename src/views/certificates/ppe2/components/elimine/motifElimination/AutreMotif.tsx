import React from 'react'

type AutreMotifProps = {
  motifsElimination: string
}
export const AutreMotif = ({ motifsElimination }: AutreMotifProps) => (
  <>
    À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je
    suis au regret de vous informer que votre offre a été éliminée pour le motif suivant : «{' '}
    {motifsElimination} ». Par conséquent, cette offre n’a pas été retenue.
  </>
)
