<#import "template.ftl" as layout>
<@layout.mainLayout active='account' bodyClass='user'; section>
  <form action="${url.accountUrl}" class="${properties.kcFormClass!}" method="post">
    <h2 class="fr-mb-4v">${msg("editAccountHtmlTitle")}</h2>
    <#--  <span class="required">*</span> ${msg("requiredFields")}</span>  -->
    <div class="${properties.kcAlertClass!} ${properties.kcAlertInfoClass!} fr-mb-8v">
      L'édition du compte n'est pas encore possible.
    </div>
    <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}" />
    <div class="${properties.kcFormGroupClass!} fr-input-group--disabled ${messagesPerField.printIfExists('email','has-error')}">
      <label for="email" class="${properties.kcLabelClass!}">${msg("email")}</label>
      <input type="text" class="${properties.kcInputClass!}" disabled id="email" name="email" autofocus value="${(account.email!'')}"/>
    </div>

    <div class="${properties.kcFormGroupClass!} fr-input-group--disabled ${messagesPerField.printIfExists('firstName','has-error')}">
      <label for="firstName" class="${properties.kcLabelClass!}">${msg("firstName")}</label>
      <input type="text" class="${properties.kcInputClass!}" disabled id="firstName" name="firstName" value="${(account.firstName!'')}"/>
    </div>

    <div class="${properties.kcFormGroupClass!} fr-input-group--disabled ${messagesPerField.printIfExists('lastName','has-error')}">
      <label for="lastName" class="${properties.kcLabelClass!}">${msg("lastName")}</label>
      <input type="text" class="${properties.kcInputClass!}" disabled id="lastName" name="lastName" value="${(account.lastName!'')}"/>
    </div>

    <div class="${properties.kcFormGroupClass!} fr-input-group--disabled flex items-center gap-6 fr-mt-8v">
        <div id="kc-form-buttons" class="submit">
          <div class="">
            <#if url.referrerURI??><a href="${url.referrerURI}">${kcSanitize(msg("backToApplication")?no_esc)}</a></#if>
            <button disabled type="submit" class="${properties.kcButtonClass!}" name="submitAction" value="Save">${msg("doSave")}</button>
            <button disabled type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonSecondaryClass!}" name="submitAction" value="Cancel">${msg("doCancel")}</button>
          </div>
        </div>
    </div>
  </form>
</@layout.mainLayout>
