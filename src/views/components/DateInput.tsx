import React, { useState } from 'react'

interface DateInputProps {
  onError: (isError: boolean) => void
}

export const DateInput = ({ onError }: DateInputProps) => {
  const dateRegex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
  const [formatError, setFormatError] = useState(false)
  const [isNotPassedError, setIsNotPassedError] = useState(false)

  const handleDateInput = (e: any) => {
    const isFormatValid = dateRegex.test(e.target.value)
    const isPast = getDateFromDateString(e.target.value) <= new Date()
    setFormatError(isFormatValid ? false : true)
    setIsNotPassedError(isPast ? false : true)
    onError(isFormatValid && isPast ? false : true)
  }

  return (
    <div>
      <input type="text" name="stepDate" onBlur={handleDateInput} required />
      {formatError && (
        <p className="notification error">
          La date saisie doit être de la forme JJ/MM/AAAA, soit par exemple 25/04/2021 pour le 25
          avril 2021.
        </p>
      )}
      {isNotPassedError && (
        <p className="notification error">
          La date saisie doit être antérieure à la date d'aujourd'hui.
        </p>
      )}
    </div>
  )
}
