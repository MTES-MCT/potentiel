# language: fr
@typologie-du-projet
@installation
Fonctionnalité: Modifier la typologie d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier la typologie du projet lauréat
        Quand le DGEC validateur modifie la typologie du projet lauréat
        Alors l'installation du projet lauréat devrait être mise à jour
        Et la typologie du projet lauréat devrait être mise à jour

        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de la typologie du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                 |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la typologie du projet Du boulodrome de Marseille |
            | nom_projet | Du boulodrome de Marseille                                                    |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                         |

    Scénario: Impossible de modifier la typologie d'un projet sans modification
        Quand le DGEC validateur modifie la typologie avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La nouvelle typologie est identique à celle du projet"

    Scénario: Impossible de modifier la typologie d'un projet avec un jeu de typologies identiques
        Quand le DGEC validateur modifie la typologie du projet avec un jeu de typologies identiques
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas sélectionner deux fois la même typologie pour le projet"
