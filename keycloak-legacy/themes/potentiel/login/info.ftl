<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
        ${messageHeader}
        <#else>
        ${message.summary}
        </#if>
    <#elseif section = "form">
    <div id="kc-info-message">
        <h3>Bienvenue sur Potentiel !</h3>
        <p class="instruction">${message.summary}<#if requiredActions??><#list requiredActions>: <ul><#items as reqActionItem><li>${msg("requiredAction.${reqActionItem}")}</li><#sep></#items></ul></#list><#else></#if></p>
        <#if pageRedirectUri?has_content>
            <a  class="button" href="${pageRedirectUri}">Poursuivre sur Potentiel</a>
        <#elseif actionUri?has_content>
            <a class="button" href="${actionUri}">Poursuivre sur Potentiel</a>
        <#elseif (client.baseUrl)?has_content>
            <a href="${client.baseUrl}">Poursuivre sur Potentiel</a>
        <#else>
            <a class="button" href="${properties.potentielUrl}/go-to-user-dashboard">Poursuivre sur Potentiel</a>
        </#if>
    </div>
    </#if>
</@layout.registrationLayout>