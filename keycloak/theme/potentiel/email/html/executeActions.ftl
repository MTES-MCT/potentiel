<#outputformat "plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#sep></#items></#list></#if></#assign>
</#outputformat>

<#import "template.ftl" as layout>
<@layout.emailLayout ; section>
  <#if section = "title">
    Invitation à rejoindre Potentiel
  <#elseif section = "intro">
    Vous avez créé un compte ou vous avez été invité à rejoindre Potentiel. Pour poursuivre la création de votre compte nous vous invitons à cliquer sur le boutons ci-dessous. Il vous sera alors demandé de créer un mot de passe.
  <#elseif section = "actionButton">
    <a href="${link}" style="display:inline-block;background:#1c38b0;color:#ffffff;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px 10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"><span style="font-size:14px;">Créer mon compte</span></a>
  <#elseif section = "outro">
    <p class="text-build-content" data-testid="I0ETIbJm4" style="margin: 10px 0; margin-top: 10px;">Cette invitation expire dans ${linkExpirationFormatter(linkExpiration)}.</p>
  </#if>
</@layout.emailLayout>