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
import { Request, Response } from 'express'
import { Feedback } from '../../../controllers/helpers/guards'

type ImportGestionnaireReseauProps = {
  request: Request
  response: Response
  feedback: Feedback
}

export const ImportGestionnaireReseau = ({ request, feedback }: ImportGestionnaireReseauProps) => {
  return (
    <PageTemplate user={request.user}>
      <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
        <div className="panel p-4">
          <h3 className="section--title">Import gestionnaire réseau</h3>
          {'success' in feedback && <SuccessErrorBox success={feedback.success} />}
          {'validationErreurs' in feedback && feedback.validationErreurs.length ? (
            <CsvValidationErrorBox validationErreurs={feedback.validationErreurs} />
          ) : (
            'error' in feedback && feedback.error && <SuccessErrorBox error={feedback.error} />
          )}
          <form
            action={routes.IMPORT_GESTIONNAIRE_RESEAU}
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
}
