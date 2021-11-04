import React from 'react'

const DateInput = ({setErrorMessage, setDisableSubmit, maxDate}) => {
    const dateRegex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    const errorFormat = 'La date saisie doit être de la forme JJ/MM/AAAA, soit par exemple 25/04/2021 pour le 25 mai 2021.'
    const errorMaxDate = 'La date saisie doit être antérieure à la date d\'aujourd\'hui.'

    const handleDateInput = (e : any) => {
        if(!dateRegex.test(e.target.value)) {
            setErrorMessage(errorFormat)
            setDisableSubmit(true)
        } else {
            if(maxDate && getDateFromDateString(e.target.value) > maxDate) {
                setErrorMessage(errorMaxDate)
                setDisableSubmit(true)
            } else {
                setErrorMessage('')
                setDisableSubmit(false)
            }
        }
    }

    return (
        <div>
            <input
                type="text"
                name="stepDate"
                onChange={handleDateInput}
                required
             />
        </div>
    )
}

export default DateInput