# language: fr
@lauréat
Fonctionnalité: Modifier le nom d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier le nom d'un projet lauréat
        Quand un administrateur modifie le nom du projet
        Alors le projet lauréat devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet             | Potentiel - Modification du nom du projet Du boulodrome de Marseille dans le département(.*) |
            | ancien_nom_projet | Du boulodrome de Marseille                                                                   |
            | url               | https://potentiel.beta.gouv.fr/projets/.*                                                    |
        Et un email a été envoyé à la dreal avec :
            | sujet             | Potentiel - Modification du nom du projet Du boulodrome de Marseille dans le département(.*) |
            | ancien_nom_projet | Du boulodrome de Marseille                                                                   |
            | url               | https://potentiel.beta.gouv.fr/projets/.*                                                    |

    Scénario: Modifier le nom d'un projet abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur modifie le nom du projet
        Alors le projet lauréat devrait être consultable

    Scénario: Impossible de modifier un lauréat sans modification
        Quand un administrateur modifie le nom du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "Les informations du projet n'ont pas été modifiées"
