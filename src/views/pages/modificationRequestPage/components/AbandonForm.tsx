import React from 'react'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
interface AbandonFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'abandon' }
}
export const AbandonForm = ({ modificationRequest }: AbandonFormProps) => (
  <>
    {!['en attente de confirmation', 'demande confirmée'].includes(modificationRequest.status) && (
      <button
        className="button"
        type="submit"
        name="submitConfirm"
        {...dataId('ask-confirmation-button')}
      >
        Demander une confirmation au porteur de projet
      </button>
    )}
  </>
)
