<#import "template.ftl" as layout>
<@layout.mainLayout active='totp' bodyClass='totp'; section>

    <h1>${msg("authenticatorTitle")}</h1>
    <#if message?has_content>
    <div class="fr-alert fr-alert--${message.type} fr-alert--sm fr-mb-3w">
      <p class="fr-alert__title">${kcSanitize(message.summary)?no_esc}</p>
    </div>
    </#if>

    <#if totp.enabled>
    <ul class="fr-m-0 fr-p-0" style="list-style: none;">
    <#list totp.otpCredentials as credential>
      <li>
        <div class="fr-tile fr-tile--horizontal">
          <div class="fr-tile__body">
            <h4 class="fr-tile__title">
              <#if totp.otpCredentials?size gt 1>
              <span>${credential.id}. </span>
              </#if>
              Validation en deux étapes activée sur téléphone mobile 
              <#if credential.userLabel?has_content>
              ${credential.userLabel}
              </#if>
            </h4>
            <p class="fr-tile__desc">
              <form action="${url.totpUrl}" method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">
                <input type="hidden" id="submitAction" name="submitAction" value="Delete">
                <input type="hidden" id="credentialId" name="credentialId" value="${credential.id}">
                <button id="remove-mobile" class="fr-btn">Supprimer</button>
              </form>
            </p>
          </div>
        </div>
      </li>
    </#list>
    </ul>

    <#else>

    <div class="fr-mb-3w">* ${msg("requiredFields")}</div>

    <ol>
        <li>
            <p>${msg("totpStep1")}</p>

            <ul id="kc-totp-supported-apps">
                <#list totp.supportedApplications as app>
                    <li>${msg(app)}</li>
                </#list>
            </ul>
        </li>

        <#if mode?? && mode = "manual">
            <li>
                <p>${msg("totpManualStep2")}</p>
                <p><span id="kc-totp-secret-key">${totp.totpSecretEncoded}</span></p>
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
        </li>
    </ol>

    <hr/>

    <form action="${url.totpUrl}" method="post">
      <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

      <div class="fr-input-group">
        <label for="totp" class="fr-label">${msg("authenticatorCode")} *</label>
        <input
          type="text"
          class="fr-input"
          id="totp"
          name="totp"
          autocomplete="off" 
          autofocus
        />
        <input type="hidden" id="totpSecret" name="totpSecret" value="${totp.totpSecret}"/>
      </div>

      <div class="fr-input-group ${messagesPerField.printIfExists('userLabel','fr-input-group--error')}">
        <label for="userLabel" class="fr-label">${msg("totpDeviceName")}</label><#if totp.otpCredentials?size gte 1><span class="required"> *</span></#if>
        <input
          type="text"
          class="fr-input ${messagesPerField.printIfExists('userLabel','fr-input--error')}"
          aria-describedby="userLabel-input-error-desc-error"
          id="userLabel"
          name="userLabel"
          autocomplete="off"
        />
        <#if messagesPerField.existsError('userLabel')>
        <p id="userLabel-input-error-desc-error" class="fr-error-text">
          ${messagesPerField.get('userLabel')}
        </p>
        </#if>
      </div>

      <ul class="fr-btns-group fr-btns-group--inline">
        <li>
          <button type="submit" class="fr-btn" id="saveTOTPBtn" name="submitAction" value="Save">${msg("doSave")}</button>
        </li>
        <li>
          <button type="submit" class="fr-btn fr-btn--secondary" id="cancelTOTPBtn" name="submitAction" value="Cancel">${msg("doCancel")}</button>
        </li>
      </ul>
    </form>
    </#if>

</@layout.mainLayout>
