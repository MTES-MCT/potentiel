import React, { useState } from 'react'
import { Request } from 'express'
import { PageLayout, RoleBasedDashboard } from '@views/components'

type ReportDemandeDelaiProps = {
  request: Request
}
export const ReportDemandeDelai = PageLayout(({ request: { user } }: ReportDemandeDelaiProps) => {
  const [status, setStatus] = useState('accepted')

  return (
    <RoleBasedDashboard role={user.role} currentPage="list-projects">
      <div className="p-3">
        <h1>Signaler une demande de délai</h1>

        <form action="" method="POST">
          <label>Date de la décision*</label>
          <input name="decisionDate" placeholder="JJ/MM/AAAA" required />

          <div className="flex flex-row gap-3 my-2">
            <div>
              <input
                type="radio"
                id="status-accepted"
                name="status"
                onChange={(e) => e.target.checked && setStatus('accepted')}
                {...(status === 'accepted' && { checked: true })}
                required
              />
              <label htmlFor="status-accepted">Acceptée</label>
            </div>
            <div>
              <input
                type="radio"
                id="status-rejected"
                name="status"
                onChange={(e) => e.target.checked && setStatus('rejected')}
                {...(status === 'rejected' && { checked: true })}
                required
              />
              <label htmlFor="status-rejected">Refusée</label>
            </div>
          </div>

          <label>Nouvelle date d'attestation de conformité*</label>
          <input name="newCompletionDueDate" placeholder="JJ/MM/AAAA" />

          <label>Courrier de la réponse (fichier joint)</label>
          <input name="answerFile" type="file" />

          <label>Notes</label>
          <textarea name="notes"></textarea>

          <button className="button primary" type="submit">
            Enregistrer
          </button>
        </form>
      </div>
    </RoleBasedDashboard>
  )
})
