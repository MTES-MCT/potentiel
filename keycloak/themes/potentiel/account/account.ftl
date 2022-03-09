<#import "template.ftl" as layout>
<@layout.mainLayout active='account' bodyClass='user'; section>

    <h1>${msg("editAccountHtmlTitle")}</h1>
    <#if message?has_content>
    <div class="fr-alert fr-alert--${message.type} fr-alert--sm fr-mb-3w">
      <p class="fr-alert__title">${kcSanitize(message.summary)?no_esc}</p>
    </div>
    </#if>
    <span>${msg("allFieldsRequired")}</span>

    <form action="${url.accountUrl}" class="fr-py-4w" method="post">
        <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

        <div class="fr-input-group">
          <label for="email" class="fr-label">${msg("email")} (ce champ n'est pas modifiable)</label>
          <input
            type="text"
            class="fr-input"
            id="email"
            name="email"
            value="${(account.email!'')}"
            readonly
          />
        </div>

        <div class="fr-input-group ${messagesPerField.printIfExists('lastName','fr-input-group--error')}">
          <label for="lastName" class="fr-label">${msg("lastName")}</label>
          <input
            type="text"
            class="fr-input ${messagesPerField.printIfExists('lastName','fr-input--error')}"
            aria-describedby="lastName-input-error-desc-error"
            id="lastName"
            name="lastName"
            autofocus
            value="${(account.lastName!'')}"
          />
          <#if messagesPerField.existsError('lastName')>
          <p id="lastName-input-error-desc-error" class="fr-error-text">
            ${messagesPerField.get('lastName')}
          </p>
          </#if>
        </div>

        <ul class="fr-btns-group fr-btns-group--inline">
          <li>
            <button type="submit" class="fr-btn" name="submitAction" value="Save">${msg("doSave")}</button>
          </li>
          <li>
            <button type="submit" class="fr-btn fr-btn--secondary" name="submitAction" value="Cancel">${msg("doCancel")}</button>
          </li>
        </ul>
    </form>

</@layout.mainLayout>
