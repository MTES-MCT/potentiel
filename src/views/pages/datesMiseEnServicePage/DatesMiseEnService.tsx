import React from 'react'
import { Input, Label, PageLayout, AdminDashboard } from '@components'

export const DatesMiseEnService = PageLayout(() => (
  <AdminDashboard currentPage="mise-à-jour-date-mise-en-service" role="admin">
    <div className="panel p-4">
      <h3 className="section--title">Mise à jour dates mise en service</h3>
      <form action="#" method="post">
        <Label>Sélectionnez le fichier du gestionnaire de réseau</Label>
        <Input type="file" required />
      </form>
    </div>
  </AdminDashboard>
))
