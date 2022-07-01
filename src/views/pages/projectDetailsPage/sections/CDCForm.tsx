import React, { useState } from 'react'
import { ProjectDataForProjectPage } from '@modules/project'
import ROUTES from '@routes'
import { CDCChoiceForm } from '../../../components'
import { Section } from '../components/Section'

type CDCFormProps = {
  project: ProjectDataForProjectPage
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const CDCForm = ({ project, cahiersChargesURLs }: CDCFormProps) => {
  const [displaySubmitButton, setDisplaySubmitButton] = useState(true)

  return (
    <Section title="Cahier des charges" icon="clipboard-check">
      <form action={ROUTES.CHANGER_CDC} method="post" className={'m-0 max-w-full'}>
        <CDCChoiceForm
          newRulesOptIn={project.newRulesOptIn}
          cahiersChargesURLs={cahiersChargesURLs}
          onChoiceChange={(isNewRule) => setDisplaySubmitButton(isNewRule)}
        />
        <input type="hidden" name="projectId" value={project.id} />
        {!project.newRulesOptIn && (
          <button
            className="button"
            type="submit"
            style={{ margin: 'auto', width: 260, display: 'block' }}
            disabled={displaySubmitButton}
          >
            Enregistrer mon changement
          </button>
        )}
      </form>
    </Section>
  )
}
