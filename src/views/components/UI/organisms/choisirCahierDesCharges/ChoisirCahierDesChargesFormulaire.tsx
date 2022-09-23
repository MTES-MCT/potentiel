import React, { useState } from 'react'
import { Button, SecondaryLinkButton } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import routes from '@routes'

import { CahierDesChargesInitial } from './CahierDesChargesInitial'
import { CahierDesChargesModifiéDisponible } from './CahierDesChargesModifiéDisponible'

type ChoisirCahierDesChargesFormulaireProps = {
  projet: ProjectDataForChoisirCDCPage
  redirectUrl?: string
  type?: ModificationRequestType
}

export const ChoisirCahierDesChargesFormulaire = ({
  projet,
  redirectUrl,
  type,
}: ChoisirCahierDesChargesFormulaireProps) => {
  const { id, appelOffre, cahierDesChargesActuel } = projet
  const [cdcChoisi, choisirCdc] = useState(cahierDesChargesActuel)
  const [peutEnregistrerLeChangement, pouvoirEnregistrerLeChangement] = useState(false)

  return (
    <form action={routes.CHANGER_CDC} method="post" className="m-0 max-w-full">
      <input type="hidden" name="redirectUrl" value={redirectUrl || routes.PROJECT_DETAILS(id)} />
      <input type="hidden" name="projectId" value={id} />
      {type && <input type="hidden" name="type" value={type} />}

      <ul className="list-none pl-0">
        <CahierDesChargesInitial
          {...{
            key: 'cahier-des-charges-initial',
            appelOffre,
            cdcChoisi,
            onCahierDesChargesChoisi: (id) => {
              choisirCdc(id)
              pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel)
            },
          }}
        />

        {appelOffre.cahiersDesChargesModifiésDisponibles.map((cdc, index) => (
          <CahierDesChargesModifiéDisponible
            {...{
              key: `cahier-des-charges-modifié-${index}`,
              cdc,
              cdcChoisi,
              onCahierDesChargesChoisi: (id) => {
                choisirCdc(id)
                pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel)
              },
            }}
          />
        ))}
      </ul>

      <div className="flex items-center justify-center">
        <Button type="submit" disabled={!peutEnregistrerLeChangement}>
          Enregistrer mon changement
        </Button>
        <SecondaryLinkButton className="ml-3" href={routes.PROJECT_DETAILS(id)}>
          Annuler
        </SecondaryLinkButton>
      </div>
    </form>
  )
}
