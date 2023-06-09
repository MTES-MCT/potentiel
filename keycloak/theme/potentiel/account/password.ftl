<#import "template.ftl" as layout>
<@layout.mainLayout active='password' bodyClass='password'; section>
  <form action="${url.passwordUrl}"  class="${properties.kcFormClass!}" method="post">
      <h2>${msg("changePasswordHtmlTitle")}</h2>
        <#if message?has_content>
          <#if message.type=='error'>
            <div class="${properties.kcAlertClass!} ${properties.kcAlertErrorClass!} fr-mb-8v">
              ${kcSanitize(message.summary)?no_esc}
            </div>
          <#elseif message.type=='warning'>
              <div class="${properties.kcAlertClass!} ${properties.kcAlertWarningClass!} fr-mb-8v">
                ${kcSanitize(message.summary)?no_esc}
              </div>
          <#else>
            <div class="${properties.kcAlertClass!} ${properties.kcAlertSuccessClass!} fr-mb-8v">
              ${kcSanitize(message.summary)?no_esc}
            </div>
          </#if>
        </#if>
      <p class="italic fr-mb-2v">${msg("allFieldsRequired")}</p>
      <input type="text" id="username" name="username" value="${(account.username!'')}" autocomplete="username" readonly="readonly" style="display:none;">
      <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

      <#if password.passwordSet>
          <div class="${properties.kcFormGroupClass!}">
            <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>
            <input type="password" class="${properties.kcInputClass!}" name="password" autofocus autocomplete="current-password">
          </div>
      </#if>

      <div class="${properties.kcFormGroupClass!}">
        <label for="password-new" class="${properties.kcLabelClass!}">${msg("passwordNew")}</label>
        <input type="password" class="${properties.kcInputClass!}" id="password-new" name="password-new" autocomplete="new-password">
      </div>

      <div class="${properties.kcFormGroupClass!}">
        <label for="password-confirm" class="${properties.kcLabelClass!}" class="two-lines">${msg("passwordConfirm")}</label>
        <input type="password" class="${properties.kcInputClass!}" id="password-confirm" name="password-confirm" autocomplete="new-password">
      </div>

      <div class="${properties.kcFormGroupClass!}">
          <div id="kc-form-buttons" class="submit">
              <div class="">
                  <button type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" name="submitAction" value="Save">${msg("doSave")}</button>
              </div>
          </div>
      </div>
  </form>
</@layout.mainLayout>
