import React, { useState } from 'react'
import { PageLayout, Button, UserDashboard, SecondaryLinkButton, ExternalLink } from '@components'
import { ProjectDataForChoisirCDCPage } from '@modules/project'
import { Request } from 'express'
import routes from '@routes'
import { hydrateOnClient } from '../../helpers'

type ChoisirCahierDesChargesProps = {
  request: Request
  projet: ProjectDataForChoisirCDCPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

type ChoisirCahierDesChargesFormulaireProps = {
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
  projet: Omit<ProjectDataForChoisirCDCPage, 'isClasse'>
  redirectUrl?: string
}

export const ChoisirCahierDesChargesFormulaire = ({
  projet,
  cahiersChargesURLs,
  redirectUrl,
}: ChoisirCahierDesChargesFormulaireProps) => {
  const { id, nouvellesRèglesDInstructionChoisies } = projet
  const [displaySubmitButton, setDisplaySubmitButton] = useState(true)
  const handleCDCChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDisplaySubmitButton(e.target.value === 'false')
  }
  return (
    <form action={routes.CHANGER_CDC} method="post" className="m-0 max-w-full">
      <div>
        {!nouvellesRèglesDInstructionChoisies && (
          <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
            <div className="inline-radio-option">
              <input
                type="hidden"
                name="redirectUrl"
                value={redirectUrl || routes.PROJECT_DETAILS(id)}
              />
              <input
                type="radio"
                name="newRulesOptIn"
                value="false"
                id="Anciennes règles"
                disabled={nouvellesRèglesDInstructionChoisies}
                defaultChecked={!nouvellesRèglesDInstructionChoisies}
                onChange={handleCDCChange}
              />
              <label htmlFor="Anciennes règles" className="flex-1">
                <strong>
                  Instruction selon les dispositions du cahier des charges en vigueur au moment de
                  la candidature &nbsp;
                </strong>
                {cahiersChargesURLs?.oldCahierChargesURL && (
                  <>
                    {'('}
                    <ExternalLink href={cahiersChargesURLs?.oldCahierChargesURL}>
                      voir le cahier des charges
                    </ExternalLink>
                    {')'}
                  </>
                )}
                .
              </label>
            </div>
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
          </div>
        )}
        <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
          <div className="inline-radio-option">
            {!nouvellesRèglesDInstructionChoisies && (
              <input
                type="radio"
                name="newRulesOptIn"
                value="true"
                id="Nouvelles règles"
                defaultChecked={nouvellesRèglesDInstructionChoisies}
                disabled={nouvellesRèglesDInstructionChoisies}
                onChange={handleCDCChange}
              />
            )}

            <label htmlFor="Nouvelles règles" className="flex-1">
              <strong>
                Instruction selon le cahier des charges modifié rétroactivement et publié le
                30/07/2021, pris en application du décret n° 2019-1175 du 14 novembre 2019&nbsp;
              </strong>
              {cahiersChargesURLs?.newCahierChargesURL && (
                <>
                  {'('}
                  <ExternalLink href={cahiersChargesURLs?.newCahierChargesURL}>
                    voir le cahier des charges
                  </ExternalLink>
                  {')'}
                </>
              )}
              .
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
export const ChoisirCahierDesCharges = PageLayout(
  ({ projet, cahiersChargesURLs }: ChoisirCahierDesChargesProps) => {
    return (
      <UserDashboard>
        <div className="panel p-4">
          <h3 className="section--title">Cahier des charges</h3>
          <p>
            Pour plus d'informations sur les modalités d'instruction veuillez consulter cette &nbsp;
            <ExternalLink href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-faire-une-demande-de-modification-ou-informer-le-prefet-dun-changement">
              page d'aide
            </ExternalLink>
            .
          </p>
          <ChoisirCahierDesChargesFormulaire
            cahiersChargesURLs={cahiersChargesURLs}
            projet={projet}
          />
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChoisirCahierDesCharges)
