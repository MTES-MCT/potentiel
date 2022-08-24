<#import "template.ftl" as layout>
<@layout.mainLayout active='password' bodyClass='password'; section>

    <h1>${msg("changePasswordHtmlTitle")}</h1>
    <#if message?has_content>
    <div class="fr-alert fr-alert--${message.type} fr-alert--sm fr-mb-3w">
      <p class="fr-alert__title">${kcSanitize(message.summary)?no_esc}</p>
    </div>
    </#if>
    <span>${msg("allFieldsRequired")}</span>

    <form action="${url.passwordUrl}" class="fr-py-4w" method="post">
        <input type="text" id="username" name="username" value="${(account.username!'')}" autocomplete="username" readonly="readonly" style="display:none;">
        <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

        <#if password.passwordSet>
        <div class="fr-input-group">
          <label for="password" class="fr-label">${msg("password")}</label>
          <input
            type="password"
            class="fr-input"
            id="password"
            name="password"
            autocomplete="current-password"
          />
        </div>
        </#if>

        <div class="fr-input-group">
          <label for="password-new" class="fr-label">${msg("passwordNew")}</label>
          <input
            type="password"
            class="fr-input"
            id="password-new"
            name="password-new"
            autocomplete="new-password"
          />
        </div>

        <div class="fr-input-group">
          <label for="password-confirm" class="fr-label">${msg("passwordConfirm")}</label>
          <input
            type="password"
            class="fr-input"
            id="password-confirm"
            name="password-confirm"
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="fr-btn" name="submitAction" value="Save">${msg("doSave")}</button>
    </form>

</@layout.mainLayout>
