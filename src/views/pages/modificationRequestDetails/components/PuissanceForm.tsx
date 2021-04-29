import React from 'react'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import { DownloadResponseTemplate } from './DownloadResponseTemplate'

interface PuissanceFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' }
}
export const PuissanceForm = ({ modificationRequest }: PuissanceFormProps) => (
  <>
    <DownloadResponseTemplate modificationRequest={modificationRequest} />

    <div className="form__group">
      <label htmlFor="file">Réponse signée (fichier pdf)</label>
      <input type="file" name="file" id="file" />
    </div>

    <div className="form__group" style={{ marginBottom: 20 }}>
      <label>
        Nouvelle puissance demandée : {modificationRequest.puissance}{' '}
        {modificationRequest.project.unitePuissance}
      </label>
      <input
        type="hidden"
        value={modificationRequest.project.puissanceInitiale}
        name="puissanceInitiale"
        {...dataId('modificationRequest-puissanceInitialeField')}
      />
      <input
        type="hidden"
        value={modificationRequest.puissance}
        name="puissance"
        {...dataId('modificationRequest-puissanceField')}
      />
    </div>

    <div className="form__group" style={{ marginBottom: 20 }}>
      <label htmlFor="statusUpdateOnly">
        <input
          type="checkbox"
          name="decisionJustice"
          {...dataId('modificationRequest-decisionJustice')}
        />
        La demande de changement de puissance fait suite à une décision de justice
      </label>
      <div style={{ fontSize: 11, lineHeight: '1.5em', marginTop: 3 }}>
        En cochant cette case, vous n'aurez pas à joindre de courrier de réponse.
      </div>
    </div>
  </>
)
