// All this to avoid a SPA...

window.initHandlers = function () {
  console.log('initHandlers')
  addActionMenuHandlers()
  addInvitationHandlers()
  addPuissanceModificationHandler()
  addDelayDateModificationHandler()
  addAOPeriodeFamilleSelectorHandlers()
  addSendCopyOfNotificationButtonHandler()
  addPaginationHandler()
  addGoToProjectPageHandlers()
  addMotifEliminationToggleHandlers()
  addProjectDetailsSectionHandlers()
}

document.addEventListener('DOMContentLoaded', (event) => {
  // console.log('DOMContentLoaded')
  // addClickHandlerForClass('project-list--action-trigger', function (e) {
  //   console.log('User click on an action trigger')
  // })
  initHandlers()
})

//
// Action menu
//

function addActionMenuHandlers() {
  const actionMenuTriggers = document.querySelectorAll(
    '[data-testid=action-menu-trigger]'
  )

  const actionMenus = document.querySelectorAll('[data-testid=action-menu]')

  function hideAllMenus() {
    actionMenus.forEach((item) => item.classList.remove('open'))
  }

  // console.log('actionMenuTriggers', actionMenuTriggers)
  actionMenuTriggers.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation()

      const menu = item.parentElement.querySelector('[data-testid=action-menu]')
      const wasVisible = menu && menu.classList.contains('open')

      hideAllMenus()

      if (menu && !wasVisible) {
        menu.classList.add('open')
      }
    })
  )

  document.addEventListener('click', hideAllMenus)
}

//
// Project page
//

function addInvitationHandlers() {
  const invitationFormShowButton = document.querySelector(
    '[data-testid=invitation-form-show-button]'
  )

  const invitationFormHideButton = document.querySelector(
    '[data-testid=invitation-form-hide-button]'
  )

  const invitationForm = document.querySelector('[data-testid=invitation-form]')

  if (invitationFormShowButton) {
    console.log('found invitation show button')
    invitationFormShowButton.addEventListener('click', function (event) {
      console.log('show button click')
      event.preventDefault()

      toggleVisibility(invitationForm, true)
    })
  }

  if (invitationFormHideButton) {
    console.log('found invitation hide button')
    invitationFormHideButton.addEventListener('click', function (event) {
      console.log('hide button click')
      event.preventDefault()

      toggleVisibility(invitationForm, false)
    })
  }
}

function addProjectDetailsSectionHandlers() {
  const sectionToggle = document.querySelectorAll(
    '[data-testid=projectDetails-section-toggle]'
  )

  sectionToggle.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault()

      const wasVisible = item.classList.contains('open')

      // Hide all sections
      // document
      //   .querySelectorAll('[data-testid=projectDetails-section-toggle]')
      //   .forEach((item) => toggleVisibility(item, false))

      toggleVisibility(item, !wasVisible)
    })
  )
}

//
// Project List
//

function addGoToProjectPageHandlers() {
  const projectButtons = document.querySelectorAll(
    '[data-testid=projectList-item]'
  )
  projectButtons.forEach((item) =>
    item.addEventListener('click', function (event) {
      // console.log('projectList-item click', item)
      event.preventDefault()

      const projectId = item.getAttribute('data-projectid')

      if (projectId) {
        location.href = '/projet/' + projectId + '/details.html'
      }
    })
  )

  // We want to ignore all clicks in the actions container (which might be inside the projectList-item area which has the click handler above)
  const actionsContainer = document.querySelectorAll(
    '[data-testid=item-actions-container]'
  )
  actionsContainer.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.stopPropagation()
    })
  )
}

function addMotifEliminationToggleHandlers() {
  const motifToggle = document.querySelectorAll(
    '[data-testid=projectList-item-toggleMotifsElimination]'
  )

  motifToggle.forEach((item) =>
    item.addEventListener('click', function (event) {
      // console.log('motif toggle click', item)
      event.preventDefault()
      event.stopPropagation()

      const icon = item.querySelector('svg')
      const wasVisible = icon && icon.style.transform === 'rotate(180deg)'
      // console.log('wasVisible', wasVisible, icon, icon.style.transform)

      // Hide all motifs
      document
        .querySelectorAll(
          '[data-testid=projectList-item-toggleMotifsElimination]'
        )
        .forEach((item) => toggleMotifVisibilty(item, false))

      toggleMotifVisibilty(item, !wasVisible)
    })
  )
}

function toggleMotifVisibilty(toggleItem, shouldBeVisible) {
  const parent = toggleItem.closest('[data-testid=projectList-item]')

  if (parent) {
    // console.log('motif toggle click found parent', parent)
    const motifs = parent.querySelector(
      '[data-testid=projectList-item-motifsElimination]'
    )

    if (motifs) {
      // console.log('motif toggle click found motifs', motifs)
      // Display this motif
      motifs.style.display = shouldBeVisible ? 'block' : 'none'

      // reverse the expand icon
      const icon = toggleItem.querySelector('svg')
      if (icon) {
        icon.style.transform = shouldBeVisible
          ? 'rotate(180deg)'
          : 'rotate(0deg)'
      }
    }
  }
}

//
// Pagination handlers
//

function addPaginationHandler() {
  const pageSizeSelectField = document.querySelector(
    '[data-testid=pageSizeSelector]'
  )

  if (pageSizeSelectField) {
    pageSizeSelectField.addEventListener('change', function (event) {
      updateFieldsInUrl({ pageSize: event.target.value, page: 0 })
    })
  }

  const goToPageButtons = document.querySelectorAll('[data-testid=goToPage]')

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
    if (value === null) queryString.delete(key)
    else queryString.set(key, value)
  })

  // We are going to change page so remove error and success messages
  queryString.delete('error')
  queryString.delete('success')

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
      '[data-testid=' + key + 'Selector]'
    )
    if (selectField) {
      selectField.addEventListener('change', function (event) {
        if (key === 'appelOffre') {
          updateFieldsInUrl({
            appelOffreId: event.target.value,
            periodeId: null,
            familleId: null,
          })
        } else {
          updateFieldInUrl(key + 'Id', event.target.value)
        }
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
    '[data-testid=modificationRequest-puissanceField]'
  )

  if (newPuissanceField) {
    var submitButton = '[data-testid=submit-button]'

    newPuissanceField.addEventListener('keyup', function (event) {
      var newValue = Number(event.target.value)

      var oldValue = getFieldValue(
        '[data-testid=modificationRequest-presentPuissanceField]'
      )

      var outOfBounds =
        '[data-testid=modificationRequest-puissance-error-message-out-of-bounds]'
      var wrongFormat =
        '[data-testid=modificationRequest-puissance-error-message-wrong-format]'

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
    '[data-testid=modificationRequest-delayedServiceDateField]'
  )

  if (delayedServiceDateField) {
    var submitButton = '[data-testid=submit-button]'

    delayedServiceDateField.addEventListener('keyup', function (event) {
      var oldDate = getDateFromDateString(
        getFieldValue(
          '[data-testid=modificationRequest-presentServiceDateField]'
        )
      )

      var newDateStr = getFieldValue(
        '[data-testid=modificationRequest-delayedServiceDateField]'
      )

      var outOfBounds =
        '[data-testid=modificationRequest-delay-error-message-out-of-bounds]'
      var wrongFormat =
        '[data-testid=modificationRequest-delay-error-message-wrong-format]'

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

function toggleVisibility(toggleItem, shouldBeVisible) {
  if (shouldBeVisible) {
    toggleItem.classList.add('open')
  } else {
    toggleItem.classList.remove('open')
  }
}

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
