import React from 'react'
import { Input, Label, AdminDashboard, Button, SuccessErrorBox, PageTemplate } from '@components'
import routes from '@routes'
import { Request } from 'express'

type ImportGestionnaireReseauProps = {
  request: Request
}

export const ImportGestionnaireReseau = ({ request }: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user}>
    <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
      <div className="panel p-4">
        <h3 className="section--title">Import gestionnaire réseau</h3>
        <SuccessErrorBox error={request.query.error as string} />
        <form
          action={routes.IMPORT_GESTIONNAIRE_RESEAU}
          method="post"
          encType="multipart/form-data"
        >
          <Label htmlFor="fichier">Fichier .csv du gestionnaire de réseau :</Label>
          <Input type="file" required name="fichier-import-date-mise-en-service" id="fichier" />
          <Button type="submit" className="mt-4">
            Mettre les projets à jour
          </Button>
        </form>
      </div>
    </AdminDashboard>
  </PageTemplate>
)
