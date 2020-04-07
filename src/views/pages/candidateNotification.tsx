import React from 'react'
import { CandidateNotification } from '../../entities'
import ROUTES from '../../routes'
import AdminDashboard from '../components/adminDashboard'

import { HttpRequest } from '../../types'

const TemplateLaureat = ({
  notification
}: {
  notification: CandidateNotification
}) => {
  return (
    <>
      <p>Madame, Monsieur,</p>
      <p>
        Conformément au cahier des charges de l'appel d'offres visé en objet,
        vous êtes informés que le(s) projet(s) que vous avez déposé(s) dans le
        cadre de cet appel d'offres et mentionné(s) en pièce jointe est(sont)
        désigné(s) lauréat(s).
      </p>
      <p>
        Afin de suivre l’évolution de votre dossier ou d’y apporter des
        modifications, nous vous invitons à{' '}
        <a
          href={ROUTES.PROJECT_INVITATION({
            projectAdmissionKey: notification.projectAdmissionKey,
            projectId: notification.projectId
          })}
        >
          créer directement un compte sur notre plateforme
        </a>
        .
      </p>

      <p>Cordialement,</p>
    </>
  )
}

const TemplateElimination = ({
  notification
}: {
  notification: CandidateNotification
}) => {
  return (
    <>
      <p>Madame, Monsieur,</p>
      <p>
        Conformément au cahier des charges de l'appel d'offres visé en objet,
        vous êtes informés que le(s) projet(s) que vous avez déposé(s) dans le
        cadre de cet appel d'offres et mentionné(s) en pièce jointe n'a (n'ont)
        pas été retenu(s) à l'issue de l'instruction des candidatures.
      </p>
      <p>
        Si vous souhaitez déposer un recours, nous vous invitons à{' '}
        <a
          href={ROUTES.PROJECT_INVITATION({
            projectAdmissionKey: notification.projectAdmissionKey,
            projectId: notification.projectId
          })}
        >
          créer directement un compte sur notre plateforme
        </a>
        .
      </p>

      <p>Cordialement,</p>
    </>
  )
}

interface PageProps {
  notification: CandidateNotification
  request: HttpRequest
}
/* Pure component */
export default function ShowCandidateNotification({ notification }: PageProps) {
  return (
    <AdminDashboard currentPage={undefined}>
      <div className="panel">
        <div className="panel__header">
          <h3>Courrier électronique envoyé au candidat</h3>
        </div>
        {notification.template === 'laureat' ? (
          <TemplateLaureat notification={notification} />
        ) : (
          <TemplateElimination notification={notification} />
        )}
      </div>
    </AdminDashboard>
  )
}
