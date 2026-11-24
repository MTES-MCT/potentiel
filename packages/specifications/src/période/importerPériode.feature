# language: fr
@période
Fonctionnalité: Importer une période

    Scénario: Un utilisateur DGEC importe une période 
        Etant donné une période avec des candidats à importer
        Quand la DGEC initié l'import d'une période
        Alors la période devrait être consultable
        Et les candidatures de la période importée devraient être consultables
        Et un email a été envoyé à l'utilisateur dgec avec :
            | sujet      | Potentiel - Import de la période 1 de l'appel d'offres PPE2 - Eolien |
            | url        | https://potentiel.beta.gouv.fr                                       |

   
