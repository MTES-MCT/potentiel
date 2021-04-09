import React from 'react'
import { dataId } from '../../helpers/testId'

interface ErrorBoxProps {
  error: string
}
export const ErrorBox = ({ error }: ErrorBoxProps) =>
  error ? (
    <div className="notification error" {...dataId('modificationRequest-errorMessage')}>
      {error}
    </div>
  ) : (
    <></>
  )
