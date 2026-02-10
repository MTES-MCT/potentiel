# language: fr
@fournisseur
Fonctionnalité: Modifier un fournisseur en tant que DREAL ou DGEC

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier un fournisseur en tant que admin
        Quand le DGEC validateur modifie le fournisseur du projet lauréat
        Alors le fournisseur devrait être mis à jour
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification des fournisseurs |
            | nom_projet | Du boulodrome de Marseille                                             |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                              |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification des fournisseurs |
            | nom_projet | Du boulodrome de Marseille                                             |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                              |

    Scénario: Modifier un fournisseur en tant que DREAL
        Quand la DREAL associée au projet modifie le fournisseur du projet lauréat
        Alors le fournisseur devrait être mis à jour
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification des fournisseurs |
            | nom_projet | Du boulodrome de Marseille                                             |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                              |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification des fournisseurs |
            | nom_projet | Du boulodrome de Marseille                                             |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                              |

    Scénario: Impossible de modifier le fournisseur avec des valeurs identiques
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec des valeurs identiques
        Alors l'utilisateur devrait être informé que "Le changement de fournisseur doit contenir une modification"

    Scénario: Impossible de modifier le fournisseur avec une valeur d'évaluation carbone négative
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec :
            | fournisseur        | Fournisseur A |
            | évaluation carbone | -1            |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone ne peut être négative"

    Scénario: Impossible de modifier le fournisseur avec une valeur d'évaluation carbone autre qu'un nombre
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec :
            | fournisseur        | Fournisseur A |
            | évaluation carbone | hello         |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit être un nombre"
