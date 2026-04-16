# language: fr
@lauréat
@site-de-production
Fonctionnalité: Modifier le site de production d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal de la sardine" associée à la région du projet

    Scénario: Modifier le site de production d'un projet lauréat
        Quand un utilisateur dgec modifie le site de production du projet
        Alors le projet lauréat devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du boulodrome de Marseille - Modification du site de production |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du boulodrome de Marseille - Modification du site de production |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                                  |

    Scénario: Modifier le site de production d'un projet abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
        Quand un utilisateur dgec modifie le site de production du projet
        Alors le projet lauréat devrait être consultable

    Scénario: Impossible de modifier le site de production d'un projet lauréat sans modification
        Quand un utilisateur dgec modifie le site de production du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "Les informations du projet n'ont pas été modifiées"
