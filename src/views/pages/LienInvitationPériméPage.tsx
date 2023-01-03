import { Link, PageTemplate } from '@components'
import React from 'react'
import { Request } from 'express'
import { hydrateOnClient } from '../helpers'

interface LienInvitationPériméProps {
  request: Request
}

export const LienInvitationPérimé = ({ request }: LienInvitationPériméProps) => {
  return (
    <PageTemplate user={request.user}>
      <main role="main">
        <section className="section section-grey">
          <div className="container">
            <h2>Lien d'invitation périmé</h2>

            <p>
              Malheureusement, le lien d'invitation que vous essayez d'utiliser n'est plus valable.
            </p>
            <p>
              N'hésitez pas à demander à la personne qui vous a invité de vous envoyer une nouvelle
              invitation ou à nous contacter sur{' '}
              <Link href="mailto:contact@potentiel.beta.gouv.fr">
                contact@potentiel.beta.gouv.fr
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </PageTemplate>
  )
}

hydrateOnClient(LienInvitationPérimé)
