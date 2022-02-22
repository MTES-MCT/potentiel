import React from 'react'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'

interface ActionnaireFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'actionnaire' }
}
export const ActionnaireForm = ({ modificationRequest }: ActionnaireFormProps) => (
  <>
    <div className="form__group mt-4 bt-4">
      <label>Nouvel actionnaire : {modificationRequest.actionnaire} </label>
      <input
        type="hidden"
        value={modificationRequest.actionnaire}
        name="actionnaire"
        {...dataId('modificationRequest-actionnaireField')}
      />
    </div>
  </>
)
