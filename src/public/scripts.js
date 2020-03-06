// All this to avoid a SPA...

document.addEventListener('DOMContentLoaded', event => {
  addClickHandler('project-list--action-trigger', function(e) {
    console.log('User click on an action trigger')
  })
})

function addClickHandler(className, handler) {
  Array.from(document.getElementsByClassName(className)).forEach(function(
    element
  ) {
    element.addEventListener('click', handler)
  })
}
