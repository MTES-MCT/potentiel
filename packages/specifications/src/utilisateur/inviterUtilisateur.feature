# language: fr
@utilisateur
Fonctionnalité: Inviter un utilisateur en tant qu'admin

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du scénario: Inviter un utilisateur avec accès global
        Quand un administrateur invite un utilisateur avec le rôle "<Rôle>"
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

        Exemples:
            | Rôle              |
            | admin             |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |

    Scénario: Inviter un DGEC validateur
        Quand un administrateur invite un dgec validateur
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

    Scénario: Inviter une dreal
        Quand un administrateur invite une dreal pour la région du projet
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

    Scénario: Inviter un gestionnaire de réseau
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Quand un administrateur invite un gestionnaire de réseau attribué au raccordement du projet lauréat
        Alors l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

    Scénario: Inviter un cocontractant
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | région | <Région> |
        Quand un administrateur invite un cocontractant pour la zone du projet
        Alors l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

        Exemples:
            | Région               |
            | Auvergne-Rhône-Alpes |
            | Mayotte              |
            | Martinique           |

    Scénario: Impossible d'inviter un utilisateur déjà invité
        Quand un administrateur invite un utilisateur avec le rôle "admin"
        Et un administrateur réinvite le même utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur existe déjà"

    Scénario: Impossible d'inviter un porteur
        Quand un administrateur invite un utilisateur avec le rôle "porteur-projet"
        Alors l'utilisateur devrait être informé que "Il est impossible d'inviter un porteur sans projet"

    Scénario: Impossible d'inviter une dreal sans région
        Quand un administrateur invite un utilisateur avec :
            | rôle   | dreal |
            | région |       |
        Alors l'utilisateur devrait être informé que "La région est obligatoire pour un utilisateur dreal"

    Scénario: Impossible d'inviter un grd sans identifiant
        Quand un administrateur invite un utilisateur avec :
            | rôle                | grd |
            | gestionnaire réseau |     |
        Alors l'utilisateur devrait être informé que "L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd"

    Scénario: Impossible d'inviter un dgec-validateur sans fonction
        Quand un administrateur invite un utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    |                 |
            | nom complet | un nom          |
        Alors l'utilisateur devrait être informé que "La fonction est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Impossible d'inviter un dgec-validateur sans nom
        Quand un administrateur invite un utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    | une fonction    |
            | nom complet |                 |
        Alors l'utilisateur devrait être informé que "Le nom complet est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Une dreal n'a accès qu'aux projets de sa région
        Etant donné le projet lauréat "Du boulodrome de Toulon" avec :
            | région | Occitanie |
        Quand un administrateur invite une dreal pour la région "Auvergne-Rhône-Alpes"
        Alors l'utilisateur invité n'a pas accès au projet lauréat

    Scénario: Un gestionnaire de réseau n'a accès qu'aux projets qu'il raccorde
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Quand un administrateur invite le gestionnaire de réseau "Arc Energies Maurienne"
        Alors l'utilisateur invité n'a pas accès au projet lauréat

    Plan du scénario: Les utilisateurs hors CRE et DGEC n'ont pas accès aux projets avant notification
        Etant donné la candidature lauréate "Du boulodrome de Toulouse"
        Quand un administrateur invite un utilisateur avec le rôle "<Rôle>"
        Alors l'utilisateur invité n'a pas accès à la candidature

        Exemples:
            | Rôle              |
            | ademe             |
            | caisse-des-dépôts |
            | dreal             |
            | cocontractant     |

    Scénario: Un cocontractant n'a accès qu'aux projets de sa zone
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | région | <Région> |
        Quand un administrateur invite un cocontractant pour la zone "<Zone>"
        Alors l'utilisateur invité n'a pas accès au projet lauréat

        Exemples:
            | Région               | Zone      |
            | Auvergne-Rhône-Alpes | zni       |
            | Auvergne-Rhône-Alpes | mayotte   |
            | Mayotte              | métropole |
            | Mayotte              | zni       |
            | Martinique           | métropole |
            | Martinique           | mayotte   |

    @NotImplemented
    Scénario: Inviter un utilisateur désactivé

