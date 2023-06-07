<#import "template.ftl" as layout>
  <@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section="header">
    <#elseif section="form">
      <div id="kc-form">
        <div>
          <#if realm.password>
            <form id="kc-form-login" class="${properties.kcFormClass!}" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post" style="padding-top: 5em">
              <#if message?has_content>
                <#if message.type=='error'>
                  <div class="fr-alert fr-alert--error">
                    ${kcSanitize(message.summary)?no_esc}
                  </div>
                  <div class="fr-alert fr-alert--warning my-4">Pour des raisons de sécurité, les mots de passes ont été remis à zéro le 7 octobre. Si vous n'avez pas mis à jour votre mot de passe depuis cette date, merci d'utiliser le lien "Mot de passe oublié".</div>
                  <#elseif message.type=='warning'>
                    <div class="fr-alert fr-alert--warnin">
                      ${kcSanitize(message.summary)?no_esc}
                    </div>
                  <#else>
                    <div class="fr-alert fr-alert--success">
                      ${kcSanitize(message.summary)?no_esc}
                    </div>
                </#if>
              </#if>
              <#if !usernameHidden??>
                <div class="${properties.kcFormGroupClass!} fr-input-group">
                  <label for="username" class="${properties.kcLabelClass!} fr-label">
                    Courrier électronique
                  </label>
                  <#if usernameEditDisabled??>
                    <input tabindex="1" id="username" class="${properties.kcInputClass!} fr-input" name="username" value="${(login.username!'')}" type="text" disabled />
                  <#else>
                    <input tabindex="1" id="username" class="${properties.kcInputClass!} fr-input" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off"
                    aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>" />
                  </#if>
                </div>
              </#if>
              <div class="${properties.kcFormGroupClass!}">
                <label for="password" class="${properties.kcLabelClass!} fr-label">
                  Mot de passe
                </label>
                <input tabindex="2" id="password" class="${properties.kcInputClass!} fr-input" name="password" type="password" autocomplete="off"
                aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>" />
              </div>
              <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-options">
                  <#if realm.rememberMe && !usernameEditDisabled??>
                    <div class="checkbox">
                      <label>
                        <#if login.rememberMe??>
                          <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked>
                          ${msg("rememberMe")}
                          <#else>
                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox">
                            ${msg("rememberMe")}
                        </#if>
                      </label>
                    </div>
                  </#if>
                </div>
              </div>
              <div id="kc-form-buttons" class="${properties.kcFormGroupClass!} flex items-center gap-6">
                <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                <button tabindex="4" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} fr-btn" name="login" id="kc-login" type="submit">Je m'identifie</button>
                <#if realm.resetPasswordAllowed>
                  <a tabindex="5" href="${url.loginResetCredentialsUrl}">Mot de passe oublié</a>
                </#if>
              </div>
              <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                <div id="kc-registration-container" class="my-8">
                  <div id="kc-registration">
                    <span>
                      ${msg("noAccount")}
                      <a tabindex="6" href="${properties.potentielUrl}/signup.html">Je crée mon compte Potentiel</a>
                    </span>
                  </div>
                </div>
              </#if>
            </form>
          </#if>
        </div>
      </div>
    <#elseif section="info">
    </#if>
  </@layout.registrationLayout>