import React from 'react'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'

interface ProducteurFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'producteur' }
}
export const ProducteurForm = ({ modificationRequest }: ProducteurFormProps) => (
  <>
    <div className="form__group mt-4 bt-4">
      <label>Nouveau producteur : {modificationRequest.producteur} </label>
      <input
        type="hidden"
        value={modificationRequest.producteur}
        name="producteur"
        {...dataId('modificationRequest-producteurField')}
      />
    </div>
  </>
)
