import React, { useState } from 'react'
import { Button, SecondaryLinkButton, ExternalLink, Input, Link } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import routes from '@routes'
import { CahierDesChargesModifié, formatCahierDesChargesActuel } from '@entities/cahierDesCharges'
import { ProjectAppelOffre } from '@entities/appelOffre'

type ChoisirCahierDesChargesFormulaireProps = {
  projet: ProjectDataForChoisirCDCPage
  redirectUrl?: string
  type?: ModificationRequestType
}

type CahierDesChargesSelectionnableProps = {
  id: string
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
  cdcChoisi: string
  désactivé?: true
}
const CahierDesChargesSelectionnable: React.FC<CahierDesChargesSelectionnableProps> = ({
  id,
  cdcChoisi,
  désactivé,
  onCahierDesChargesChoisi,
  children,
}) => (
  <li className="inline-radio-option relative">
    <input
      type="radio"
      name="choixCDC"
      value={id}
      id={id}
      checked={cdcChoisi === id}
      disabled={désactivé}
      onChange={() => onCahierDesChargesChoisi(id)}
      className="peer absolute left-4"
    />
    <label
      htmlFor={id}
      className="flex-1 border border-gray-400 border-solid rounded p-5 mb-5 pl-10 peer-checked:border-2 peer-checked:border-blue-france-main-525-base peer-checked:bg-blue-france-975-base hover:cursor-pointer peer-disabled:cursor-not-allowed"
    >
      {children}
    </label>
  </li>
)

type CahierDesChargesInitialProps = {
  appelOffre: ProjectAppelOffre
  cdcChoisi: string
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
}
const CahierDesChargesInitial: React.FC<CahierDesChargesInitialProps> = ({
  appelOffre,
  cdcChoisi,
  onCahierDesChargesChoisi,
}) => {
  const id = 'initial'
  return (
    <CahierDesChargesSelectionnable
      {...{
        key: id,
        id,
        cdcChoisi,
        onCahierDesChargesChoisi,
        désactivé: true,
      }}
    >
      <span className="font-bold">
        Instruction selon les dispositions du cahier des charges en vigueur au moment de la
        candidature &nbsp;
      </span>
      {appelOffre.periode.cahierDesCharges.url && (
        <>
          {'('}
          <ExternalLink href={appelOffre.periode.cahierDesCharges.url}>
            voir le cahier des charges
          </ExternalLink>
          {')'}
        </>
      )}
      .
      {appelOffre.choisirNouveauCahierDesCharges && (
        <ul className="mt-2 list-none md:list-disc p-1 md:pl-10">
          <li>Je dois envoyer ma demande ou mon signalement au format papier.</li>
          <li>
            Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le souhaite.
          </li>
        </ul>
      )}
    </CahierDesChargesSelectionnable>
  )
}

type CahierDesChargesModifiéDisponibleProps = {
  cdc: CahierDesChargesModifié
  cdcChoisi: string
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
}

const CahierDesChargesModifiéDisponible: React.FC<CahierDesChargesModifiéDisponibleProps> = ({
  cdc,
  cdcChoisi,
  onCahierDesChargesChoisi,
}) => {
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
            cdcChoisi,
            onCahierDesChargesChoisi: (id) => {
              choisirCdc(id)
              pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel)
            },
          }}
          {...{ key: 'initial', cahierDesChargesActuel, appelOffre }}
        />

        {appelOffre.cahiersDesChargesModifiésDisponibles.map((cdc) => (
          <CahierDesChargesModifiéDisponible
            {...{
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
