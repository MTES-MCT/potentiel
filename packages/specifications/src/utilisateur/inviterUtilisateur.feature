# language: fr
Fonctionnalité: Inviter un utilisateur en tant qu'admin

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du scénario: Inviter un utilisateur avec accès global
        Quand un administrateur invite un utilisateur avec le rôle "<Rôle>"
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html   |

        Exemples:
            | Rôle              |
            | admin             |
            | acheteur-obligé   |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |

    Scénario: Inviter un DGEC validateur
        Quand un administrateur invite un dgec validateur
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html   |

    Scénario: Inviter une dreal
        Quand un administrateur invite une dreal pour la région du projet
        Alors l'utilisateur devrait être actif
        Et l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html   |

    Scénario: Inviter un gestionnaire de réseau
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Quand un administrateur invite un gestionnaire de réseau attribué au raccordement du projet lauréat
        Alors l'utilisateur invité a accès au projet lauréat
        Et un email a été envoyé au nouvel utilisateur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html   |

    Scénario: Impossible d'inviter un utilisateur déjà invité
        Quand un administrateur invite un utilisateur avec le rôle "admin"
        Et un administrateur réinvite le même utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur existe déjà"

    Scénario: Impossible d'inviter un porteur
        Quand un administrateur invite un utilisateur avec le rôle "porteur-projet"
        Alors l'utilisateur devrait être informé que "Il est impossible d'inviter un porteur sans projet"

    Scénario: Impossible d'inviter une dreal sans région
        Quand un administrateur invite un utilisateur avec le rôle "dreal"
        Alors l'utilisateur devrait être informé que "La région est obligatoire pour un utilisateur dreal"

    Scénario: Impossible d'inviter un grd sans identifiant
        Quand un administrateur invite un utilisateur avec le rôle "grd"
        Alors l'utilisateur devrait être informé que "L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd"

    Scénario: Impossible d'inviter un dgec-validateur sans fonction
        Quand un administrateur invite un utilisateur avec le rôle "dgec-validateur"
        Alors l'utilisateur devrait être informé que "La fonction est obligatoire pour un utilisateur dgec-validateur"

    @NotImplemented
    Scénario: Inviter un utilisateur désactivé

