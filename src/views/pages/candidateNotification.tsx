import React from 'react'

import { CandidateNotification } from '../../entities'
import ROUTES from '../../routes'

interface PageProps {
  notification: CandidateNotification
}

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
          href={
            ROUTES.PROJECT_ADMISSION + '?p=' + notification.projectAdmissionKey
          }
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
          href={
            ROUTES.PROJECT_ADMISSION + '?p=' + notification.projectAdmissionKey
          }
        >
          créer directement un compte sur notre plateforme
        </a>
        .
      </p>

      <p>Cordialement,</p>
    </>
  )
}

/* Pure component */
export default function CandidateNotificationPage({ notification }: PageProps) {
  if (notification.template === 'laureat') {
    return <TemplateLaureat notification={notification} />
  }

  if (notification.template === 'elimination') {
    return <TemplateElimination notification={notification} />
  }
}
