import React from 'react'
import { dataId } from '../../helpers/testId'

interface SuccessErrorBoxProps {
  success?: string
  error?: string
}

export const SuccessErrorBox = ({ error, success }: SuccessErrorBoxProps) => (
  <>
    {success ? (
      <div className="notification success" {...dataId('success-message')}>
        {success}
      </div>
    ) : (
      ''
    )}
    {error ? (
      <div className="notification error" {...dataId('error-message')}>
        {error}
      </div>
    ) : (
      ''
    )}
  </>
)
