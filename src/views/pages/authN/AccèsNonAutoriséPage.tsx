import React from 'react'
import { PageTemplate } from '@views/components'
import { Request } from 'express'

type AccèsNonAutoriséProps = {
  request: Request
}

export const AccèsNonAutorisé = ({ request }: AccèsNonAutoriséProps) => (
  <PageTemplate {...request}>
    <h1>Accès non autorisé</h1>
    <p className="mt-0 text-sm">Erreur 403</p>
    <p>Votre compte ne vous permet pas d'accéder à cette ressource.</p>
  </PageTemplate>
)
