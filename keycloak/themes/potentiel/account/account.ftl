<#import "template.ftl" as layout>
<@layout.mainLayout active='account' bodyClass='user'; section>

    <h1>${msg("editAccountHtmlTitle")}</h1>
    <#if message?has_content>
    <div class="fr-alert fr-alert--${message.type} fr-alert--sm fr-mb-3w">
      <p class="fr-alert__title">${kcSanitize(message.summary)?no_esc}</p>
    </div>
    </#if>
    <#--  <span>${msg("allFieldsRequired")}</span>  -->
    <div class="fr-alert fr-alert--info fr-alert--sm fr-mb-3w">
      <p class="fr-alert__title">
        L'édition des nom et prénom du compte n'est pas encore possible.
      </p>
    </div>

    <div>${msg("email")} : ${(account.email!'')}</div>

    <form action="${url.accountUrl}" class="fr-py-2w" method="post">
        <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

        <div class="fr-input-group fr-input-group--disabled ${messagesPerField.printIfExists('lastName','fr-input-group--error')}">
          <label for="lastName" class="fr-label">Nom, Prénom</label>
          <input
            type="text"
            class="fr-input ${messagesPerField.printIfExists('lastName','fr-input--error')}"
            aria-describedby="lastName-input-error-desc-error"
            id="lastName"
            name="lastName"
            autofocus
            disabled
            value="${(account.lastName!'')}"
          />
          <#if messagesPerField.existsError('lastName')>
          <p id="lastName-input-error-desc-error" class="fr-error-text">
            ${messagesPerField.get('lastName')}
          </p>
          </#if>
        </div>

        <ul class="fr-btns-group fr-input-group--disabled fr-btns-group--inline">
          <li>
            <button
              type="submit"
              class="fr-btn"
              name="submitAction"
              value="Save"
              disabled
            >
              ${msg("doSave")}
            </button>
          </li>
          <li>
            <button
              type="submit"
              class="fr-btn fr-btn--secondary"
              name="submitAction"
              value="Cancel"
              disabled
            >
              ${msg("doCancel")}
            </button>
          </li>
        </ul>
      </fieldset>
    </form>

</@layout.mainLayout>
