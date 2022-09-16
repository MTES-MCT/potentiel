import React, { useState } from 'react'
import { Button, SecondaryLinkButton, ExternalLink } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import routes from '@routes'
import { CahierDesChargesModifié, ProjectAppelOffre } from '@entities'

type ChoisirCahierDesChargesFormulaireProps = {
  projet: ProjectDataForChoisirCDCPage
  redirectUrl?: string
  type?: ModificationRequestType
}

const getIdCahierDesCharges = (cdc: CahierDesChargesModifié) =>
  `${cdc.paruLe}${cdc.alternatif ? '#alternatif' : ''}`

type CahierDesChargesInitialProps = {
  cahierDesChargesActuel: ProjectDataForChoisirCDCPage['cahierDesChargesActuel']
  appelOffre: ProjectAppelOffre
}

const CahierDesChargesInitial: React.FC<CahierDesChargesInitialProps> = ({
  cahierDesChargesActuel,
  appelOffre,
}) => {
  return (
    <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
      <div className="inline-radio-option">
        <input
          type="radio"
          name="choixCDC"
          value="initial"
          id="Anciennes règles"
          disabled={true}
          defaultChecked={cahierDesChargesActuel === 'initial'}
        />
        <label htmlFor="Anciennes règles" className="flex-1">
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
        </label>
      </div>
      {appelOffre.choisirNouveauCahierDesCharges && (
        <div>
          <ul>
            <li style={{ listStyleImage: 'URL(/images/icons/external/arrow-right.svg)' }}>
              Je dois envoyer ma demande ou mon signalement au format papier.
            </li>
            <li style={{ listStyleImage: 'URL(/images/icons/external/arrow-right.svg)' }}>
              Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le
              souhaite.
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

type CahierDesChargesModifiéDisponibleProps = {
  cdc: CahierDesChargesModifié
  cahierDesChargesActuel: ProjectDataForChoisirCDCPage['cahierDesChargesActuel']
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
}

const CahierDesChargesModifiéDisponible: React.FC<CahierDesChargesModifiéDisponibleProps> = ({
  cdc,
  cahierDesChargesActuel,
  onCahierDesChargesChoisi,
}) => {
  const idCdc = getIdCahierDesCharges(cdc)
  const coché = cahierDesChargesActuel === getIdCahierDesCharges(cdc)

  return (
    <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
      <div className="inline-radio-option">
        <input
          type="radio"
          name="choixCDC"
          value={idCdc}
          id="Nouvelles règles"
          defaultChecked={coché}
          disabled={coché}
          onChange={() => onCahierDesChargesChoisi(idCdc)}
        />

        <label htmlFor="Nouvelles règles" className="flex-1">
          <span className="font-bold">
            Instruction selon le cahier des charges modifié rétroactivement et publié le
            {cdc.paruLe}&nbsp;
          </span>
          {'('}
          <ExternalLink href={cdc.url}>voir le cahier des charges</ExternalLink>
          {')'}.
        </label>
      </div>
      <div>
        <ul>
          <li style={{ listStyleImage: 'URL(/images/icons/external/arrow-right.svg)' }}>
            Ce choix s'appliquera à toutes les futures demandes faites sous Potentiel.
          </li>
          <li style={{ listStyleImage: 'URL(/images/icons/external/arrow-right.svg)' }}>
            Une modification ultérieure pourra toujours être instruite selon le cahier des charges
            en vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise au format
            papier en précisant ce choix.
          </li>
        </ul>
      </div>
    </div>
  )
}

export const ChoisirCahierDesChargesFormulaire = ({
  projet,
  redirectUrl,
  type,
}: ChoisirCahierDesChargesFormulaireProps) => {
  const { id, appelOffre, cahierDesChargesActuel } = projet
  const [peutEnregistrerLeChangement, pouvoirEnregistrerLeChangement] = useState(false)

  return (
    <form action={routes.CHANGER_CDC} method="post" className="m-0 max-w-full">
      <input type="hidden" name="redirectUrl" value={redirectUrl || routes.PROJECT_DETAILS(id)} />
      <input type="hidden" name="projectId" value={id} />
      {type && <input type="hidden" name="type" value={type} />}

      <CahierDesChargesInitial {...{ cahierDesChargesActuel, appelOffre }} />

      {appelOffre.cahiersDesChargesModifiésDisponibles.map((cdc) => (
        <CahierDesChargesModifiéDisponible
          {...{
            key: getIdCahierDesCharges(cdc),
            cdc,
            cahierDesChargesActuel,
            onCahierDesChargesChoisi: () => pouvoirEnregistrerLeChangement(true),
          }}
        />
      ))}

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
