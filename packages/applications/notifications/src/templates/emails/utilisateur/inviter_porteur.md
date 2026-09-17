---
subject: Invitation à suivre les projets sur Potentiel
---

Madame, Monsieur,

Ceci est une invitation de la part de **{{invitéPar}}** à rejoindre Potentiel pour suivre {{#if tousLesProjets }}les projets{{else}} le projet{{/if}} :

{{{projetALister}}}

{{#if tousLesProjets}}
{{cta url 'Accéder aux projets'}}
{{else}}
{{cta url 'Accéder au projet'}}
{{/if}}
