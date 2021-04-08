import React from 'react'
import { dataId } from '../../helpers/testId'

interface SuccessBoxProps {
  success: string
}
export const SuccessBox = ({ success }: SuccessBoxProps) =>
  success ? (
    <div className="notification success" {...dataId('modificationRequest-successMessage')}>
      {success}
    </div>
  ) : (
    <></>
  )
