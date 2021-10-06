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
            <a  class="button" href="${pageRedirectUri}">Aller sur Potentiel</a>
        <#elseif actionUri?has_content>
            <a class="button" href="${actionUri}">Aller sur Potentiel</a>
        <#elseif (client.baseUrl)?has_content>
            <a href="${client.baseUrl}">Aller sur Potentiel</a>
        <#else>
            <a class="button" href="${properties.potentielUrl}/go-to-user-dashboard">Aller sur Potentiel}</a>
        </#if>
    </div>
    </#if>
</@layout.registrationLayout>