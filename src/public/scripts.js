// All this to avoid a SPA...

document.addEventListener('DOMContentLoaded', event => {
  addClickHandlerForClass('project-list--action-trigger', function(e) {
    console.log('User click on an action trigger')
  })

  addPuissanceModificationHandler()
})

function addPuissanceModificationHandler() {
  const newPuissanceField = document.querySelector(
    '[data-testId=modificationRequest-puissanceField]'
  )

  if (newPuissanceField) {
    newPuissanceField.addEventListener('keyup', function(event) {
      var newValue = Number(event.target.value)

      var oldValue = getFieldValue(
        '[data-testId=modificationRequest-presentPuissanceField]'
      )

      var outOfBounds =
        '[data-testId=modificationRequest-puissance-error-message-out-of-bounds]'
      var wrongFormat =
        '[data-testId=modificationRequest-puissance-error-message-wrong-format]'
      var submitButton = '[data-testId=modificationRequest-submit-button]'

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

function addClickHandlerForClass(className, handler) {
  Array.from(document.getElementsByClassName(className)).forEach(function(
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
  }
}
