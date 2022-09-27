import React, { useState } from 'react'
import { Button, Input, Link, SecondaryLinkButton } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import routes from '@routes'
import { formatCahierDesChargesActuel } from '@entities/cahierDesCharges'

import { CahierDesChargesInitial } from './CahierDesChargesInitial'
import { CahierDesChargesModifiéDisponible } from './CahierDesChargesModifiéDisponible'
import { CahierDesChargesSelectionnable } from './CahierDesChargesSélectionnable'

type ChoisirCahierDesChargesFormulaireProps = {
  projet: ProjectDataForChoisirCDCPage
  redirectUrl?: string
  type?: ModificationRequestType
}

export const ChoisirCahierDesChargesFormulaire: React.FC<
  ChoisirCahierDesChargesFormulaireProps
> = ({ projet, redirectUrl, type }) => {
  const { id: projetId, appelOffre, cahierDesChargesActuel, identifiantGestionnaireRéseau } = projet
  const [cdcChoisi, choisirCdc] = useState(cahierDesChargesActuel)
  const [peutEnregistrerLeChangement, pouvoirEnregistrerLeChangement] = useState(false)

  return (
    <form action={routes.CHANGER_CDC} method="post" className="m-0 max-w-full">
      <input
        type="hidden"
        name="redirectUrl"
        value={redirectUrl || routes.PROJECT_DETAILS(projetId)}
      />
      <input type="hidden" name="projectId" value={projetId} />
      {type && <input type="hidden" name="type" value={type} />}

      <ul className="list-none pl-0">
        <CahierDesChargesSelectionnable
          {...{
            key: 'cahier-des-charges-initial',
            id: 'initial',
            sélectionné: cdcChoisi === 'initial',
            désactivé: true,
          }}
        >
          <CahierDesChargesInitial
            {...{
              appelOffre,
              cdcChoisi,
            }}
          />
        </CahierDesChargesSelectionnable>

        {appelOffre.cahiersDesChargesModifiésDisponibles.map((cahierDesChargesModifié, index) => {
          const idCdc = formatCahierDesChargesActuel(cahierDesChargesModifié)
          const sélectionné = cdcChoisi === idCdc

          return (
            <CahierDesChargesSelectionnable
              {...{
                key: `cahier-des-charges-modifié-${index}`,
                id: idCdc,
                onCahierDesChargesChoisi: (id) => {
                  choisirCdc(id)
                  pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel)
                },
                sélectionné,
              }}
            >
              <CahierDesChargesModifiéDisponible {...cahierDesChargesModifié} />

              {sélectionné &&
                cahierDesChargesModifié.numéroGestionnaireRequis &&
                (idCdc === cahierDesChargesActuel ? (
                  <>
                    Identifiant gestionnaire de réseau pour votre projet déjà renseigné :{' '}
                    {identifiantGestionnaireRéseau}
                  </>
                ) : (
                  <>
                    <label className="mt-2 mb-1" htmlFor="identifiantGestionnaireRéseau">
                      Pour récupérer votre date de mise en service et ainsi pouvoir bénéficier des
                      avantages de ce cahier des charges, vous devez renseigner l'identifiant
                      gestionnaire de réseau pour votre projet : * (Champs obligatoire)
                    </label>
                    <Input
                      id="identifiantGestionnaireRéseau"
                      name="identifiantGestionnaireRéseau"
                      type="text"
                      placeholder="Identifiant gestionnaire de réseau"
                      defaultValue={identifiantGestionnaireRéseau}
                      required
                    />
                    <Link href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
                      Où trouver mon numéro ?
                    </Link>
                  </>
                ))}
            </CahierDesChargesSelectionnable>
          )
        })}
      </ul>

      <div className="flex items-center justify-center">
        <Button type="submit" disabled={!peutEnregistrerLeChangement}>
          Enregistrer mon changement
        </Button>
        <SecondaryLinkButton className="ml-3" href={routes.PROJECT_DETAILS(projetId)}>
          Annuler
        </SecondaryLinkButton>
      </div>
    </form>
  )
}
