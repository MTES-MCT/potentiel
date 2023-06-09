<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
  <#if section = "header">
      ${msg("emailForgotTitle")}
  <#elseif section = "form">
    <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
        <div class="${properties.kcFormGroupClass!}">
            <a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a>

            <p class="fr-mt-8v">Entrez votre courrier électronique; un email va vous être envoyé vous permettant de créer un nouveau mot de passe.</p>
            <div class="${properties.kcFormGroupClass!} <#if messagesPerField.existsError('username')>fr-input-group--error</#if>">
              <label for="username" class="${properties.kcLabelClass!}">Courrier électronique</label>
              <#if auth?has_content && auth.showUsername()>
                <input type="email" id="username" name="username" class="${properties.kcInputClass!}" autofocus value="${auth.attemptedUsername}" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
              <#else>
                <input type="email" id="username" name="username" class="${properties.kcInputClass!}" autofocus aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
              </#if>
              <#if messagesPerField.existsError('username')>
                <p id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                  Veuillez entrer votre courrier électronique
                </p>
              </#if>
            </div>
        </div>
        <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
            <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                <input class="${properties.kcButtonClass!}" type="submit" value="${msg("doSubmit")}"/>
            </div>
        </div>
    </form>
  <#elseif section = "info" >
  </#if>
</@layout.registrationLayout>
