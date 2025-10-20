# language: fr
@utilisateur
Fonctionnalité: Désactiver un utilisateur

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: Désactiver un utilisateur (hors Porteur de projet)
        Etant donné un utilisateur invité avec le rôle "<Rôle>"
        Quand un administrateur désactive l'utilisateur
        Alors l'utilisateur devrait être désactivé

        Exemples:
            | Rôle              |
            | admin             |
            | acheteur-obligé   |
            | cocontractant     |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |
            | dreal             |
            | dgec-validateur   |
            | grd               |

    Scénario: Un porteur de projet désactivé ne recoit plus d'email
        Etant donné le porteur du projet désactivé
        Quand la DREAL associée au projet modifie l'actionnaire pour le projet lauréat
        Alors un email n'a pas été envoyé au porteur avec :
            | sujet | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
        Mais un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |

    Scénario: Un utilisateur désactivé ne recoit plus d'email
        Etant donné un utilisateur désactivé avec le rôle "ademe"
        Et une période avec des candidats importés
        Quand un DGEC validateur notifie la période d'un appel d'offres
        Alors un email n'a pas été envoyé à l'utilisateur avec :
            | sujet | Potentiel - Notification de la période (.*) de l'appel d'offres (.*) |
        Mais un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Notification de la période (.*) de l'appel d'offres (.*) |

    Scénario: Désactiver un porteur de projet
        Quand un administrateur désactive le porteur du projet
        Alors le porteur devrait être désactivé

    Scénario: Impossible de désactiver son propre compte
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'utilisateur désactive son compte
        Alors l'utilisateur devrait être informé que "Il est impossible de désactiver son propre compte"

    Scénario: Impossible de désactiver un utilisateur déjà désactivé
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur désactive l'utilisateur
        Et un administrateur désactive l'utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas actif"
