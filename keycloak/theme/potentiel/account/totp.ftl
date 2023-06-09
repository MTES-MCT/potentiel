<#import "template.ftl" as layout>
<@layout.mainLayout active='totp' bodyClass='totp'; section>
  <h2 id="top">${msg("authenticatorTitle")}</h2>

  <#if totp.enabled>
    <table class="table table-bordered table-striped">
      <thead>
        <#if totp.otpCredentials?size gt 1>
          <tr>
              <th colspan="4">${msg("configureAuthenticators")}</th>
          </tr>
        <#else>
          <tr>
              <th colspan="3">${msg("configureAuthenticators")}</th>
          </tr>
        </#if>
      </thead>
      <tbody>
        <#list totp.otpCredentials as credential>
          <tr>
            <td class="provider">${msg("mobile")}</td>
            <#if totp.otpCredentials?size gt 1>
              <td class="provider">${credential.id}</td>
            </#if>
            <td class="provider">${credential.userLabel!}</td>
            <td class="action">
              <form action="${url.totpUrl}" method="post" class="form-inline">
                  <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">
                  <input type="hidden" id="submitAction" name="submitAction" value="Delete">
                  <input type="hidden" id="credentialId" name="credentialId" value="${credential.id}">
                  <button id="remove-mobile" class="btn btn-default">
                      <i class="pficon pficon-delete"></i>
                  </button>
              </form>
            </td>
          </tr>
        </#list>
      </tbody>
    </table>
  <#else>
    <ol>
      <li>
        <p>${msg("totpStep1")}</p>
        <ul>
          <#list totp.supportedApplications as app>
            <li>${msg(app)}</li>
          </#list>
        </ul>
      </li>
      <#if mode?? && mode = "manual">
        <li>
          <p>${msg("totpManualStep2")}</p>
          <p><b id="kc-totp-secret-key">${totp.totpSecretEncoded}</b></p>
          <p><a href="${totp.qrUrl}" id="mode-barcode">${msg("totpScanBarcode")}</a></p>
        </li>
        <li>
          <p>${msg("totpManualStep3")}</p>
          <ul>
              <li id="kc-totp-type">${msg("totpType")}: ${msg("totp." + totp.policy.type)}</li>
              <li id="kc-totp-algorithm">${msg("totpAlgorithm")}: ${totp.policy.getAlgorithmKey()}</li>
              <li id="kc-totp-digits">${msg("totpDigits")}: ${totp.policy.digits}</li>
              <#if totp.policy.type = "totp">
                  <li id="kc-totp-period">${msg("totpInterval")}: ${totp.policy.period}</li>
              <#elseif totp.policy.type = "hotp">
                  <li id="kc-totp-counter">${msg("totpCounter")}: ${totp.policy.initialCounter}</li>
              </#if>
          </ul>
        </li>
      <#else>
        <li>
          <p>${msg("totpStep2")}</p>
          <p><img src="data:image/png;base64, ${totp.totpSecretQrCode}" alt="Figure: Barcode"></p>
          <p><a href="${totp.manualUrl}" id="mode-manual">${msg("totpUnableToScan")}</a></p>
        </li>
      </#if>
      <li>
        <p>${msg("totpStep3")}</p>
        <p>${msg("totpStep3DeviceName")}</p>
      </li>
    </ol>

    <hr/>

    <form action="${url.totpUrl}" class="${properties.kcFormClass!}" method="post">
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

      <#if totp.otpCredentials?size == 0>
        <p class="italic fr-mb-2v">* ${msg("requiredFields")}</p>
      </#if>

      <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">
      <div class="${properties.kcFormGroupClass!}">
        <label for="totp" class="${properties.kcLabelClass!}">${msg("authenticatorCode")} *</label>
        <input type="text" class="${properties.kcInputClass!}" id="totp" name="totp" autocomplete="off" autofocus>
        <input type="hidden" id="totpSecret" name="totpSecret" value="${totp.totpSecret}"/>
      </div>

      <div class="${properties.kcFormGroupClass!}" ${messagesPerField.printIfExists('userLabel',properties.kcFormGroupErrorClass!)}">
        <label for="userLabel" class="${properties.kcLabelClass!}">${msg("totpDeviceName")}</label> <#if totp.otpCredentials?size gte 1><span class="required">*</span></#if>
        <input type="text" class="${properties.kcInputClass!}" id="userLabel" name="userLabel" autocomplete="off">
      </div>

      <div class="${properties.kcFormGroupClass!}">
        <div id="kc-form-buttons" class="col-md-offset-2 col-md-10 submit">
          <div>
            <button type="submit"
              class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}"
              id="saveTOTPBtn" name="submitAction" value="Save">${msg("doSave")}
            </button>
            <#--  <button type="submit"
              class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}"
              id="cancelTOTPBtn" name="submitAction" value="Cancel">${msg("doCancel")}
            </button>  -->
          </div>
        </div>
      </div>
    </form>
    </#if>

</@layout.mainLayout>
