// All this to avoid a SPA...

window.initHandlers = function () {
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
