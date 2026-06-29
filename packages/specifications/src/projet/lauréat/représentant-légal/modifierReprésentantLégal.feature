# language: fr
@représentant-légal
Fonctionnalité: Modifier le représentant légal d'un projet lauréat

    Scénario: Modifier le représentant légal d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie le nom et le type du représentant légal
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification du représentant légal |
            | nom_projet | Du boulodrome de Marseille                                                  |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                  |

    Scénario: Modifier le représentant légal d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Paris"
        Et un cahier des charges permettant la modification du projet
        Et une demande d'abandon accordée pour le projet lauréat
        Quand le DGEC validateur modifie le nom et le type du représentant légal
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Paris - Modification du représentant légal |
            | nom_projet | Du boulodrome de Paris                                                  |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                              |

    Scénario: Modifier le représentant légal d'un projet lauréat achevé
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et un cahier des charges permettant la modification du projet
        Et l'achèvement réel transmis pour le projet lauréat
        Quand le DGEC validateur modifie le nom et le type du représentant légal
        Alors le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Lyon - Modification du représentant légal |
            | nom_projet | Du boulodrome de Lyon                                                  |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                             |

    Scénario: Impossible de modifier le représentant légal d'un projet lauréat inexistant
        Quand le DGEC validateur modifie le nom et le type du représentant légal
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de modifier le représentant légal avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Toulouse"
        Quand le DGEC validateur modifie le nom et le type du représentant légal avec les mêmes valeurs
        Alors l'utilisateur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"


    Scénario: Impossible de modifier le représentant légal s'il a le même nom que l'actuel
        Etant donné le projet lauréat "Du boulodrome de Biarritz"
        Quand le DGEC validateur modifie le représentant légal avec le même nom
        Alors l'utilisateur devrait être informé que "Le représentant légal a le même nom que celui associé au projet"

    Scénario: Impossible de modifier le représentant légal d'un projet lauréat si une demande de changement de représentant légal est en cours
        Etant donné le projet lauréat "Du boulodrome de Grenoble"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet
        Et une demande de changement de représentant légal en cours
        Quand le DGEC validateur modifie le nom et le type du représentant légal
        Alors l'utilisateur devrait être informé que "Impossible de modifier le représentant légal car une demande de changement est déjà en cours"
