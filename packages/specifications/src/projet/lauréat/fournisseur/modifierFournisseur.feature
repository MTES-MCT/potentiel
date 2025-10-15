# language: fr
@fournisseur
Fonctionnalité: Modifier un fournisseur

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier un fournisseur
        Quand le DGEC validateur modifie le fournisseur du projet lauréat
        Alors le fournisseur devrait être mis à jour
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de fournisseur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                     |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de fournisseur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                     |

    Scénario: Impossible de modifier le fournisseur avec des valeurs identiques
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec des valeurs identiques
        Alors l'utilisateur devrait être informé que "Le changement de fournisseur doit contenir une modification"

    Scénario: Impossible de modifier le fournisseur avec une valeur d'évaluation carbone négative
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec :
            | fournisseur        | Fournisseur A |
            | évaluation carbone | 10            |
            | évaluation carbone | -1            |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone ne peut être négative"

    Scénario: Impossible de modifier le fournisseur avec une valeur d'évaluation carbone autre qu'un nombre
        Quand le DGEC validateur modifie le fournisseur du projet lauréat avec :
            | fournisseur        | Fournisseur A |
            | évaluation carbone | 10            |
            | évaluation carbone | hello         |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit être un nombre"
