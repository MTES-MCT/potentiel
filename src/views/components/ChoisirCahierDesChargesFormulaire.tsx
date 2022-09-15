import React, { useState } from 'react'
import { Button, SecondaryLinkButton, ExternalLink } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import routes from '@routes'
import {
  CahierDesChargesModifié,
  DateParutionCahierDesChargesModifié,
} from '@entities/cahierDesCharges'

type ChoixCDC = {
  paruLe: DateParutionCahierDesChargesModifié & 'initial'
  alternatif?: true
}

type ChoisirCahierDesChargesFormulaireProps = {
  projet: Omit<ProjectDataForChoisirCDCPage, 'isClasse'>
  cdcChoisi: ChoixCDC
  redirectUrl?: string
  type?: ModificationRequestType
}

export const ChoisirCahierDesChargesFormulaire = ({
  projet,
  cdcChoisi,
  redirectUrl,
  type,
}: ChoisirCahierDesChargesFormulaireProps) => {
  const { id, nouvellesRèglesDInstructionChoisies } = projet
  const [displaySubmitButton, setDisplaySubmitButton] = useState(true)
  const handleCDCChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDisplaySubmitButton(e.target.value === 'false')
  }
  return (
    <form action={routes.CHANGER_CDC} method="post" className="m-0 max-w-full">
      <input type="hidden" name="redirectUrl" value={redirectUrl || routes.PROJECT_DETAILS(id)} />
      {type && <input type="hidden" name="type" value={type} />}

      <div>
        <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
          <div className="inline-radio-option">
            <input
              type="radio"
              name="choixCDC"
              value="initial"
              id="Anciennes règles"
              disabled={true}
              defaultChecked={cdcChoisi.paruLe === 'initial'}
            />
            <label htmlFor="Anciennes règles" className="flex-1">
              <strong>
                Instruction selon les dispositions du cahier des charges en vigueur au moment de la
                candidature &nbsp;
              </strong>
              {projet.appelOffre?.periode.cahierDesCharges.url && (
                <>
                  {'('}
                  <ExternalLink href={projet.appelOffre?.periode.cahierDesCharges.url}>
                    voir le cahier des charges
                  </ExternalLink>
                  {')'}
                </>
              )}
              .
            </label>
          </div>
          {projet.appelOffre?.choisirNouveauCahierDesCharges && (
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

        {projet.appelOffre?.cahiersDesChargesModifiésDisponibles.map((cdc) => (
          <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
            <div className="inline-radio-option">
              <input
                type="radio"
                name="choixCDC"
                value={`${cdc.paruLe}${cdc.alternatif ? '#alternatif' : ''}`}
                id="Nouvelles règles"
                defaultChecked={estChoisi(cdcChoisi, cdc)}
                disabled={estChoisi(cdcChoisi, cdc)}
                onChange={handleCDCChange}
              />

              <label htmlFor="Nouvelles règles" className="flex-1">
                <strong>
                  Instruction selon le cahier des charges modifié rétroactivement et publié le
                  {cdc.paruLe}&nbsp;
                </strong>
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
                  Une modification ultérieure pourra toujours être instruite selon le cahier des
                  charges en vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise
                  au format papier en précisant ce choix.
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
      <input type="hidden" name="projectId" value={id} />
      <div className="flex items-center justify-center">
        {!nouvellesRèglesDInstructionChoisies && (
          <Button
            type="submit"
            className="w-260"
            style={{ display: 'block' }}
            disabled={displaySubmitButton}
          >
            Enregistrer mon changement
          </Button>
        )}
        <SecondaryLinkButton className="ml-3" href={routes.PROJECT_DETAILS(id)}>
          Annuler
        </SecondaryLinkButton>
      </div>
    </form>
  )
}
const estChoisi = (choix: ChoixCDC, cdc: CahierDesChargesModifié): boolean =>
  choix.paruLe === cdc.paruLe && choix.alternatif === cdc.alternatif
