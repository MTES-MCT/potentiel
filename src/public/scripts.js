// All this to avoid a SPA...

document.addEventListener('DOMContentLoaded', (event) => {
  addClickHandlerForClass('project-list--action-trigger', function (e) {
    console.log('User click on an action trigger')
  })

  addPuissanceModificationHandler()
  addDelayDateModificationHandler()
  addAOPeriodeFamilleSelectorHandlers()
  addSendCopyOfNotificationButtonHandler()
  addPaginationHandler()
})

//
// Pagination handlers
//

function addPaginationHandler() {
  const pageSizeSelectField = document.querySelector(
    '[data-testId=pageSizeSelector]'
  )

  if (pageSizeSelectField) {
    pageSizeSelectField.addEventListener('change', function (event) {
      updateFieldsInUrl({ pageSize: event.target.value, page: 0 })
    })
  }

  const goToPageButtons = document.querySelectorAll('[data-testId=goToPage]')

  goToPageButtons.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault()
      const pageValue = event.target.getAttribute('data-pagevalue')

      updateFieldInUrl('page', pageValue)
    })
  )
}

//
// AO/Periode selector handler
//

function updateFieldsInUrl(fields) {
  // Update the URL with the new appel offre Id or periode Id
  const queryString = new URLSearchParams(window.location.search)

  Object.entries(fields).forEach(([key, value]) => {
    queryString.set(key, value)
  })

  window.location.replace(
    window.location.origin +
      window.location.pathname +
      '?' +
      queryString.toString()
  )
}

function updateFieldInUrl(field, value) {
  updateFieldsInUrl({ [field]: value })
}

function addAOPeriodeFamilleSelectorHandlers() {
  ;['appelOffre', 'periode', 'famille'].forEach((key) => {
    const selectField = document.querySelector(
      '[data-testId=' + key + 'Selector]'
    )
    if (selectField) {
      selectField.addEventListener('change', function (event) {
        updateFieldInUrl(key + 'Id', event.target.value)
      })
    }
  })
}

function addSendCopyOfNotificationButtonHandler() {
  const sendCopyButtons = document.querySelectorAll(
    '[data-actionid=send-copy-of-notification]'
  )

  if (sendCopyButtons) {
    // console.log('Found sendCopyButtons, adding listener', sendCopyButtons)
    sendCopyButtons.forEach((item) =>
      item.addEventListener('click', function (event) {
        // event.stopPropagation()
        event.preventDefault()
        const link = event.target.getAttribute('href')

        if (!link) {
          console.log('Cannot call send copy because missing  link', link)
          return
        }

        fetch(link).then((response) => {
          if (response.ok) {
            // console.log('GET to send copy of candidate notification succeeded')
            alert(
              'Une copie de la notification de ce candidat a été envoyée à votre adresse email'
            )
          } else {
            console.log(
              'GET to send copy of candidate notification failed',
              response.error
            )
            alert("L'envoi de copie de notification a échoué.")
          }
        })

        return false
      })
    )
  } else {
    // console.log('Cannot find send copy buttons')
  }
}

//
// Puissance modification Page
//

function addPuissanceModificationHandler() {
  const newPuissanceField = document.querySelector(
    '[data-testId=modificationRequest-puissanceField]'
  )

  if (newPuissanceField) {
    var submitButton = '[data-testId=submit-button]'

    newPuissanceField.addEventListener('keyup', function (event) {
      var newValue = Number(event.target.value)

      var oldValue = getFieldValue(
        '[data-testId=modificationRequest-presentPuissanceField]'
      )

      var outOfBounds =
        '[data-testId=modificationRequest-puissance-error-message-out-of-bounds]'
      var wrongFormat =
        '[data-testId=modificationRequest-puissance-error-message-wrong-format]'

      if (!Number.isNaN(newValue) && !Number.isNaN(oldValue)) {
        console.log('Both are number')
        if (newValue > oldValue || newValue / oldValue < 0.9) {
          show(outOfBounds, true)
          show(wrongFormat, false)
        } else {
          show(outOfBounds, false)
          show(wrongFormat, false)
        }
        disable(submitButton, false)
      } else {
        disable(submitButton, true)
        show(outOfBounds, false)
        show(wrongFormat, true)
      }
    })
  }
}

//
// Delay request Page
//

function getDateFromDateString(str) {
  // For a date in the DD/MM/YYYY format
  var day = Number(str.substring(0, 2))
  var month = Number(str.substring(3, 5))
  var year = Number(str.substring(6))

  return new Date(year, month - 1, day)
}

var dateRegex = new RegExp(
  /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/
)

function addDelayDateModificationHandler() {
  const delayedServiceDateField = document.querySelector(
    '[data-testId=modificationRequest-delayedServiceDateField]'
  )

  if (delayedServiceDateField) {
    var submitButton = '[data-testId=submit-button]'

    delayedServiceDateField.addEventListener('keyup', function (event) {
      var oldDate = getDateFromDateString(
        getFieldValue(
          '[data-testId=modificationRequest-presentServiceDateField]'
        )
      )

      var newDateStr = getFieldValue(
        '[data-testId=modificationRequest-delayedServiceDateField]'
      )

      var outOfBounds =
        '[data-testId=modificationRequest-delay-error-message-out-of-bounds]'
      var wrongFormat =
        '[data-testId=modificationRequest-delay-error-message-wrong-format]'

      if (newDateStr.length < 6) {
        // Ignore, user is still typing
        return
      }

      if (!dateRegex.test(newDateStr)) {
        disable(submitButton, true)
        show(outOfBounds, false)
        show(wrongFormat, true)
      } else {
        // Date is valid format
        var newDate = getDateFromDateString(newDateStr)

        if (newDate.getTime() <= oldDate.getTime()) {
          // Date is before old date
          disable(submitButton, true)
          show(outOfBounds, true)
          show(wrongFormat, false)
        } else {
          // all good
          show(outOfBounds, false)
          show(wrongFormat, false)
          disable(submitButton, false)
        }
      }
    })
  }
}

//
// General utility
//

function addClickHandlerForClass(className, handler) {
  Array.from(document.getElementsByClassName(className)).forEach(function (
    element
  ) {
    element.addEventListener('click', handler)
  })
}

function getFieldValue(selector) {
  var elem = document.querySelector(selector)

  if (elem) {
    return elem.value
  }
}

function show(selector, isVisible) {
  var elem = document.querySelector(selector)

  if (elem) {
    elem.style.display = isVisible ? 'inherit' : 'none'
  }
}

function disable(selector, isDisabled) {
  var elem = document.querySelector(selector)

  if (elem) {
    if (isDisabled) elem.setAttribute('disabled', true)
    else elem.removeAttribute('disabled')
  } else {
    console.error('Call disable on void selector', selector)
  }
}
