import React from 'react'
import { Input, Label, PageLayout, AdminDashboard, Button } from '@components'

export const DatesMiseEnService = PageLayout(() => (
  <AdminDashboard currentPage="mise-à-jour-date-mise-en-service" role="admin">
    <div className="panel p-4">
      <h3 className="section--title">Mise à jour dates mise en service</h3>
      <form action="#" method="post">
        <Label>Fichier .csv du gestionnaire de réseau :</Label>
        <Input type="file" required />
        <Button type="submit" className="mt-4">
          Mettre les projets à jour
        </Button>
      </form>
    </div>
  </AdminDashboard>
))
