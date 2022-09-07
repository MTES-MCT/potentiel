import React, { useState } from 'react'
import {
  PageLayout,
  ExternalLinkIcon,
  Link,
  Button,
  UserDashboard,
  SecondaryButton,
  ChevronLeftIcon,
} from '@components'
import { ProjectDataForProjectPage } from '@modules/project'
import { Request } from 'express'
import ROUTES from '@routes'
import { hydrateOnClient } from '../../helpers'

type ChoisirCahierDesChargesProps = {
  request: Request
  projet: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChoisirCahierDesCharges = PageLayout(
  ({ projet, cahiersChargesURLs }: ChoisirCahierDesChargesProps) => {
    const [displaySubmitButton, setDisplaySubmitButton] = useState(true)
    const { newRulesOptIn } = projet
    const handleCDCChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setDisplaySubmitButton(e.target.value === 'false')
    }

    return (
      <UserDashboard showMenu={false}>
        <SecondaryButton onClick={() => window.history.back()} className="mb-4">
          <ChevronLeftIcon /> Retour
        </SecondaryButton>
        <div className="panel p-4">
          <h3 className="section--title">Choisir le cahier des charges</h3>
          <form action={ROUTES.CHANGER_CDC} method="post" className="m-0 max-w-full">
            <div>
              <p>
                Pour plus d'informations sur les modalités d'instruction veuillez consulter cette
                &nbsp;
                <Link
                  className="inline-flex items-center"
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-faire-une-demande-de-modification-ou-informer-le-prefet-dun-changement"
                  target="_blank"
                >
                  page d'aide
                  <ExternalLinkIcon className="ml-1" />
                </Link>
                .
              </p>
              {!newRulesOptIn && (
                <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
                  <div className="inline-radio-option">
                    <input
                      type="radio"
                      name="newRulesOptIn"
                      value="false"
                      id="Anciennes règles"
                      disabled={newRulesOptIn}
                      defaultChecked={!newRulesOptIn}
                      onChange={handleCDCChange}
                    />
                    <label htmlFor="Anciennes règles" className="flex-1">
                      <strong>
                        Instruction selon les dispositions du cahier des charges en vigueur au
                        moment de la candidature &nbsp;
                      </strong>
                      {cahiersChargesURLs?.oldCahierChargesURL && (
                        <Link href={cahiersChargesURLs?.oldCahierChargesURL}>
                          (voir le cahier des charges)
                        </Link>
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
                        Je pourrai changer de mode d'instruction lors de ma prochaine demande si je
                        le souhaite.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className={'border border-gray-400 border-solid rounded p-5 mb-5'}>
                <div className="inline-radio-option">
                  {!newRulesOptIn && (
                    <input
                      type="radio"
                      name="newRulesOptIn"
                      value="true"
                      id="Nouvelles règles"
                      defaultChecked={newRulesOptIn}
                      disabled={newRulesOptIn}
                      onChange={handleCDCChange}
                    />
                  )}

                  <label htmlFor="Nouvelles règles" className="flex-1">
                    <strong>
                      Instruction selon le cahier des charges modifié rétroactivement et publié le
                      30/07/2021, pris en application du décret n° 2019-1175 du 14 novembre
                      2019&nbsp;
                    </strong>
                    {cahiersChargesURLs?.newCahierChargesURL && (
                      <Link href={cahiersChargesURLs?.newCahierChargesURL}>
                        (voir le cahier des charges)
                      </Link>
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
                      charges en vigueur au moment du dépôt de l'offre, à condition qu'elle soit
                      soumise au format papier en précisant ce choix.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <input type="hidden" name="projectId" value={projet.id} />
            {!projet.newRulesOptIn && (
              <Button
                type="submit"
                className="mx-auto w-260"
                style={{ display: 'block' }}
                disabled={displaySubmitButton}
              >
                Enregistrer mon changement
              </Button>
            )}
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChoisirCahierDesCharges)
