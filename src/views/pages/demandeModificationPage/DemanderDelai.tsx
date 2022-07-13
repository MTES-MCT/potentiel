import {
  CDCChoiceForm,
  ModificationRequestActionTitles,
  PageLayout,
  ProjectInfo,
  SuccessErrorBox,
  UserDashboard,
} from '@components'
import { Project } from '@entities'
import routes from '@routes'

import { Request } from 'express'
import React, { useState } from 'react'

import { dataId } from '../../../helpers/testId'
import { hydrateOnClient } from '../../helpers'

import { DemanderDelaiForm } from './components'

type DemanderDelaiProps = {
  request: Request
  project: any
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const DemanderDelai = PageLayout((props: DemanderDelaiProps) => {
  const {
    request: { query },
    project,
    cahiersChargesURLs,
  } = props

  const { action, error, success, puissance, actionnaire, justification, dateAchèvementDemandée } =
    (query as any) || {}

  const isEolien = project.appelOffre?.type === 'eolien'
  const [displayForm, setDisplayForm] = useState(project.newRulesOptIn)
  const [isSubmitButtonDisabled, setDisableSubmitButton] = useState(false)

  return (
    <UserDashboard currentPage={'list-requests'}>
      <h1>test</h1>
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>
            <ModificationRequestActionTitles action={'delai'} />
          </h3>
        </div>
      </div>

      <form action={routes.DEMANDE_DELAI_ACTION} method="post" encType="multipart/form-data">
        <input type="hidden" name="projectId" value={project.id} />
        <input type="hidden" name="type" value={action} />
        <div className="form__group">
          <div style={{ marginBottom: 5 }}>Concernant le projet:</div>
          <ProjectInfo project={project} className="mb-3" />
          <SuccessErrorBox success={success} error={error} />
          {!isEolien && (
            <div>
              <label className="required">
                <strong>
                  Veuillez saisir les modalités d'instruction à appliquer à ce changement
                </strong>
              </label>
              <CDCChoiceForm
                newRulesOptIn={project.newRulesOptIn}
                cahiersChargesURLs={cahiersChargesURLs}
                onChoiceChange={(isNewRule: boolean) => setDisplayForm(!isNewRule)}
              />
            </div>
          )}

          {(isEolien || displayForm) && (
            <div {...dataId('modificationRequest-demandesInputs')}>
              <DemanderDelaiForm {...{ project, dateAchèvementDemandée, justification }} />

              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
                disabled={(isEolien && action === 'producteur') || isSubmitButtonDisabled}
              >
                Envoyer
              </button>
              <a
                className="button-outline primary"
                {...dataId('cancel-button')}
                href={routes.USER_LIST_PROJECTS}
              >
                Annuler
              </a>
            </div>
          )}
        </div>
      </form>
    </UserDashboard>
  )
})

hydrateOnClient(DemanderDelai)
