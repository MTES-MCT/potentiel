// All this to avoid a SPA...

window.initHandlers = function () {
  addSelectorHandlers();
  addSendCopyOfNotificationButtonHandler();
  addPaginationHandler();
  addVisibilityToggleHandler();
  addConfirmHandlers();
  addGoToOnClickHandlers();
  addMissingOwnerProjectListSelectionHandler();
};

document.addEventListener('DOMContentLoaded', () => window.initHandlers());

function addGoToOnClickHandlers() {
  const targets = document.querySelectorAll('[data-goto-onclick]');
  targets.forEach((item) =>
    item.addEventListener('click', function (event) {
      if (event.target.nodeName !== 'A' && event.target.nodeName !== 'INPUT') {
        event.preventDefault();

        const url = item.getAttribute('data-goto-onclick');

        if (url) {
          location.href = url;
        }
      }
    }),
  );

  // We want to ignore all clicks in the actions container (which might be inside the area which has the click handler above)
  const actionsContainer = document.querySelectorAll('[data-testid=item-actions-container]');
  actionsContainer.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.stopPropagation();
    }),
  );
}

//
// Project List
//
function addMissingOwnerProjectListSelectionHandler() {
  const projectCheckboxes = document.querySelectorAll(
    '[data-testid=missingOwnerProjectList-item-checkbox]',
  );

  const selectAllCheckbox = document.querySelector(
    '[data-testid=missingOwnerProjectList-selectAll-checkbox]',
  );

  const claimProjectsSubmitButton = document.querySelector(
    '[data-testid=claim-projects-submit-button]',
  );

  const swornStatementCheckbox = document.querySelector('[data-testid=sworn-statement]');

  const claimedProjectList = document.querySelector('[data-testid=claimed-project-list]');

  function updateAccessFormVisibility() {
    claimedProjectList?.options.length && swornStatementCheckbox?.checked
      ? (claimProjectsSubmitButton.disabled = false)
      : (claimProjectsSubmitButton.disabled = true);
  }

  function findOption(options, value) {
    for (const option of options) {
      if (option.value === value) return option;
    }
  }

  function toggleProjectInList(projectId, isSelected) {
    if (claimedProjectList) {
      const projectOption = findOption(claimedProjectList.options, projectId);
      if (isSelected && !projectOption) {
        claimedProjectList.options.add(new Option(projectId, projectId, true, true));
      }

      if (!isSelected && projectOption) {
        projectOption.remove();
      }
    }

    updateAccessFormVisibility();
  }

  function toggleProjectBox(item, isSelected) {
    const projectId = item.getAttribute('data-projectid');

    item.checked = isSelected;

    toggleProjectInList(projectId, isSelected);
  }

  projectCheckboxes.forEach((item) =>
    item.addEventListener('change', function (event) {
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
      }

      toggleProjectBox(item, event.target.checked);
    }),
  );

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function (event) {
      projectCheckboxes.forEach((item) => toggleProjectBox(item, event.target.checked));
    });

    swornStatementCheckbox.addEventListener('change', function () {
      updateAccessFormVisibility();
    });
  }
}

function toggleMotifVisibilty(toggleItem, shouldBeVisible) {
  const parent = toggleItem.closest('[data-testid=projectList-item]');

  if (parent) {
    const motifs = parent.querySelector('[data-testid=projectList-item-motifsElimination]');

    if (motifs) {
      // Display this motif
      motifs.style.display = shouldBeVisible ? 'block' : 'none';

      // reverse the expand icon
      const icon = toggleItem.querySelector('svg');
      if (icon) {
        icon.style.transform = shouldBeVisible ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  }
}

//
// Pagination handlers
//

function addPaginationHandler() {
  const pageSizeSelectField = document.querySelector('[data-testid=pageSizeSelector]');

  if (pageSizeSelectField) {
    pageSizeSelectField.addEventListener('change', function (event) {
      updateFieldsInUrl({ pageSize: event.target.value, page: 0 });
    });
  }

  const goToPageButtons = document.querySelectorAll('[data-testid=goToPage]');

  goToPageButtons.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const pageValue = event.target.getAttribute('data-pagevalue');

      updateFieldInUrl('page', pageValue);
    }),
  );
}

//
// AO/Periode selector handler
//

function updateFieldsInUrl(fields) {
  // Update the URL with the new appel offre Id or periode Id
  const queryString = new URLSearchParams(window.location.search);

  Object.entries(fields).forEach(([key, value]) => {
    if (value === null) queryString.delete(key);
    else queryString.set(key, value);
  });

  // We are going to change page so remove error and success messages
  queryString.delete('error');
  queryString.delete('success');

  window.location.replace(
    window.location.origin + window.location.pathname + '?' + queryString.toString(),
  );
}

function updateFieldInUrl(field, value) {
  updateFieldsInUrl({ [field]: value });
}

function addSelectorHandlers() {
  [
    'appelOffreId',
    'periodeId',
    'familleId',
    'beforeDate',
    'garantiesFinancieres',
    'classement',
    'modificationRequestStatus',
    'modificationRequestType',
    'reclames',
  ].forEach((key) => {
    const selectField = document.querySelector('[data-testid=' + key + 'Selector]');
    if (selectField) {
      selectField.addEventListener('change', function (event) {
        if (key === 'appelOffreId') {
          updateFieldsInUrl({
            appelOffreId: event.target.value,
            periodeId: null,
            familleId: null,
          });
        } else {
          updateFieldInUrl(key, event.target.value);
        }
      });
    }
  });

  document.querySelectorAll('[data-testid=resetSelectors]').forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault();

      window.location.replace(window.location.origin + window.location.pathname);

      return false;
    }),
  );
}

function addSendCopyOfNotificationButtonHandler() {
  const sendCopyButtons = document.querySelectorAll('[data-actionid=send-copy-of-notification]');

  if (sendCopyButtons) {
    sendCopyButtons.forEach((item) =>
      item.addEventListener('click', function (event) {
        // event.stopPropagation()
        event.preventDefault();
        const link = event.target.getAttribute('href');

        if (!link) {
          console.error('Cannot call send copy because missing  link', link);
          return;
        }

        fetch(link).then((response) => {
          if (response.ok) {
            alert(
              'Une copie de la notification de ce candidat a été envoyée à votre adresse email',
            );
          } else {
            console.error('GET to send copy of candidate notification failed', response.error);
            alert("L'envoi de copie de notification a échoué.");
          }
        });

        return false;
      }),
    );
  } else {
  }
}
//
// General utility
//

function addConfirmHandlers() {
  const confirmableLinks = document.querySelectorAll('[data-confirm]');

  confirmableLinks.forEach((item) =>
    item.addEventListener('click', function (event) {
      if (!confirm(item.getAttribute('data-confirm'))) event.preventDefault();
    }),
  );
}

function addVisibilityToggleHandler() {
  const sectionToggle = document.querySelectorAll('[data-testid=visibility-toggle]');

  sectionToggle.forEach((item) =>
    item.addEventListener('click', function (event) {
      event.preventDefault();

      const wasVisible = item.classList.contains('open');

      toggleVisibility(item, !wasVisible);
    }),
  );
}

function toggleVisibility(toggleItem, shouldBeVisible) {
  if (shouldBeVisible) {
    toggleItem.classList.add('open');
  } else {
    toggleItem.classList.remove('open');
  }
}

function getFieldValue(selector) {
  var elem = document.querySelector(selector);

  if (elem) {
    return elem.value;
  }
}

function showElement(element, isVisible) {
  if (element) {
    element.style.display = isVisible ? 'inherit' : 'none';
  }
}

function show(selector, isVisible) {
  var elem = document.querySelector(selector);

  showElement(elem, isVisible);
}

function disableButton(button, isDisabled) {
  if (button) {
    if (isDisabled) button.setAttribute('disabled', true);
    else button.removeAttribute('disabled');
  }
}

function disable(selector, isDisabled) {
  var elem = document.querySelector(selector);

  disableButton(elem, isDisabled);
}
