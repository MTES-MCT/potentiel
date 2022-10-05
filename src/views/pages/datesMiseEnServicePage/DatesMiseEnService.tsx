import React from 'react'
import { Input, Label, PageLayout, AdminDashboard, Button, SuccessErrorBox } from '@components'
import routes from '@routes'
import { Request } from 'express'

type DatesMiseEnServiceProps = {
  request: Request
}

export const DatesMiseEnService = PageLayout(({ request }: DatesMiseEnServiceProps) => (
  <AdminDashboard currentPage="mise-à-jour-date-mise-en-service" role="admin">
    <div className="panel p-4">
      <h3 className="section--title">Mise à jour dates mise en service</h3>
      <SuccessErrorBox error={request.query.error as string} />
      <form
        action={routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU}
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
))
