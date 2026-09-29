---
subject: Invitation à suivre les projets sur Potentiel
---

Madame, Monsieur,

Ceci est une invitation de la part de **{{invitéPar}}** à rejoindre Potentiel pour suivre {{#if tousLesProjets }}les projets{{else}} le projet{{/if}} :

<ul>
{{#each projetALister}}
<li style="margin-bottom: 5px"><a href="{{url}}">{{nom}} ({{appelOffre}} période {{période}})</a></li>
{{/each}}
</ul>

{{cta url 'Accéder à mes projets (lauréat)'}}
