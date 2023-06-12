<#import "template.ftl" as layout>
  <@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section="header">
    <#elseif section="form">
      <div id="kc-form">
        <#if realm.password>
          <form id="kc-form-login" class="${properties.kcFormClass!}" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            <#if realm.registrationAllowed && !registrationDisabled??>
              <div id="kc-registration-container" class="fr-mb-8v">
                <div id="kc-registration">
                  <span>
                    ${msg("noAccount")}
                    <a tabindex="6" href="${properties.potentielUrl}/signup.html">Je crée mon compte Potentiel</a>
                  </span>
                </div>
              </div>
            </#if>
            <#if message?has_content>
              <#if message.type=='error'>
                <div class="${properties.kcAlertClass!} ${properties.kcAlertErrorClass!}">
                  ${kcSanitize(message.summary)?no_esc}
                </div>
                <div class="${properties.kcAlertClass!} ${properties.kcAlertWarningClass!} fr-my-4v">Pour des raisons de sécurité, les mots de passes ont été remis à zéro le 7 octobre. Si vous n'avez pas mis à jour votre mot de passe depuis cette date, merci d'utiliser le lien "Mot de passe oublié".</div>
                <#elseif message.type=='warning'>
                  <div class="${properties.kcAlertClass!} ${properties.kcAlertWarningClass!}">
                    ${kcSanitize(message.summary)?no_esc}
                  </div>
                <#else>
                  <div class="${properties.kcAlertClass!} ${properties.kcAlertSuccessClass!}">
                    ${kcSanitize(message.summary)?no_esc}
                  </div>
              </#if>
            </#if>
            <#if !usernameHidden??>
              <div class="${properties.kcFormGroupClass!}">
                <label for="username" class="${properties.kcLabelClass!}">
                  Courrier électronique
                </label>
                <#if usernameEditDisabled??>
                  <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text" disabled />
                <#else>
                  <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off"
                  aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>" />
                </#if>
              </div>
            </#if>
            <div class="${properties.kcFormGroupClass!}">
              <label for="password" class="${properties.kcLabelClass!} fr-label">
                Mot de passe
              </label>
              <input tabindex="2" id="password" class="${properties.kcInputClass!}" name="password" type="password" autocomplete="off"
              aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>" />
            </div>
            <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
              <div id="kc-form-options">
                <#if realm.rememberMe && !usernameEditDisabled??>
                  <div class="fr-checkbox-group mt-2">
                    <#if login.rememberMe??>
                      <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked>
                    <#else>
                      <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox">
                    </#if>
                    <label class="fr-label" for="rememberMe">
                        ${msg("rememberMe")}
                    </label>
                    <div class="fr-messages-group" id="rememberMe-messages" aria-live="assertive">
                    </div>
                  </div>
                </#if>
              </div>
            </div>
            <div class="${properties.kcFormGroupClass!} fr-grid-row fr-grid-row--bottom fr-mt-8v">
              <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
              <button tabindex="4" class="${properties.kcButtonClass!} fr-mr-4v" name="login" id="kc-login" type="submit">Je m'identifie</button>
              <#if realm.resetPasswordAllowed>
                <a tabindex="5" href="${url.loginResetCredentialsUrl}">Mot de passe oublié</a>
              </#if>
            </div>
          </form>
        </#if>
      </div>
    <#elseif section="info">
    </#if>
  </@layout.registrationLayout>