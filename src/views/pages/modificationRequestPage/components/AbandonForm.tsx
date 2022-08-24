import React from 'react'
import { Button } from '@components'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
interface AbandonFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'abandon' }
}
export const AbandonForm = ({ modificationRequest }: AbandonFormProps) => (
  <>
    {!['en attente de confirmation', 'demande confirmée'].includes(modificationRequest.status) && (
      <Button
        type="submit"
        name="submitConfirm"
        {...dataId('ask-confirmation-button')}
        className="mt-2"
      >
        Demander une confirmation au porteur de projet
      </Button>
    )}
  </>
)
