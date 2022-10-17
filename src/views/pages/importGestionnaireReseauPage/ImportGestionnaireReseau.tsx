import React from 'react'
import {
  Input,
  Label,
  AdminDashboard,
  Button,
  PageTemplate,
  SuccessErrorBox,
  CsvValidationErrorBox,
} from '@components'
import routes from '@routes'
import { Request } from 'express'
import { Feedback } from '../../../controllers/helpers/guards'

type ImportGestionnaireReseauProps = {
  request: Request
  feedback: Feedback
}

const AfficherFeedback = ({ feedback }: { feedback: Feedback }) => {
  if ('success' in feedback) {
    return <SuccessErrorBox success={feedback.success} />
  }
  if ('validationErreurs' in feedback) {
    return <CsvValidationErrorBox validationErreurs={feedback.validationErreurs} />
  }
  if ('error' in feedback) {
    return <SuccessErrorBox error={feedback.error} />
  }

  return null
}

export const ImportGestionnaireReseau = ({ request, feedback }: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user}>
    <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
      <div className="panel p-4">
        <h3 className="section--title">Import gestionnaire réseau</h3>
        {feedback && <AfficherFeedback feedback={feedback} />}
        <form
          action={routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU}
          method="post"
          encType="multipart/form-data"
        >
          <Label htmlFor="fichier">Fichier .csv du gestionnaire de réseau :</Label>
          <Input type="file" required name="fichier-import-gestionnaire-réseau" id="fichier" />
          <Button type="submit" className="mt-4">
            Mettre les projets à jour
          </Button>
        </form>
      </div>
    </AdminDashboard>
  </PageTemplate>
)
