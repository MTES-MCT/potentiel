import React from 'react'
import { ExternalLink, Input, Link } from '@components'
import { CahierDesChargesModifié, formatCahierDesChargesActuel } from '@entities/cahierDesCharges'

import { CahierDesChargesSelectionnable } from './CahierDesChargesSélectionnable'

type CahierDesChargesModifiéDisponibleProps = {
  cdc: CahierDesChargesModifié
  cdcChoisi: string
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
}

export const CahierDesChargesModifiéDisponible: React.FC<
  CahierDesChargesModifiéDisponibleProps
> = ({ cdc, cdcChoisi, onCahierDesChargesChoisi }) => {
  const id = formatCahierDesChargesActuel(cdc)

  return (
    <CahierDesChargesSelectionnable
      {...{
        key: id,
        id,
        cdcChoisi,
        onCahierDesChargesChoisi,
      }}
    >
      <span className="font-bold">
        Instruction selon le cahier des charges{cdc.alternatif ? ' alternatif' : ''} modifié{' '}
        rétroactivement et publié le {cdc.paruLe}{' '}
      </span>
      {'('}
      <ExternalLink href={cdc.url}>voir le cahier des charges</ExternalLink>
      {')'}.
      <ul className="mt-2 list-none p-1 md:list-disc md:pl-10">
        <li>Ce choix s'appliquera à toutes les futures demandes faites sous Potentiel.</li>
        <li>
          Une modification ultérieure pourra toujours être instruite selon le cahier des charges en
          vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise au format papier
          en précisant ce choix.
        </li>
        {cdc.numéroGestionnaireRequis && (
          <li>
            <label htmlFor="identifiantGestionnaireRéseau">
              Pour pouvoir bénéficier des avantages de ce cahier des charges, vous devez renseigner
              l'identifiant gestionnaire de réseau pour votre projet : *
            </label>
            <Input
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              type="text"
              placeholder="Identifiant gestionnaire de réseau"
              required
            />
            <Link href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
              Où trouver mon numéro ?
            </Link>
          </li>
        )}
      </ul>
    </CahierDesChargesSelectionnable>
  )
}
