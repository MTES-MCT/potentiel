# language: fr
@producteur
Fonctionnalité: Modifier le producteur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier le producteur d'un projet lauréat en tant qu'admin
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |

    Scénario: Modifier le producteur d'un projet lauréat abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |

    Scénario: Modifier le producteur d'un projet lauréat achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié          |
            | nom_projet | Du boulodrome de Marseille                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement /.* |

    Scénario: Modifier le producteur d'un projet lauréat dont l'appel d'offres empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat legacy "Du boulodrome de Marseille" avec :
            | appel d'offres | Eolien |
            | période        | 1      |
        Et la dreal "Dreal du nord" associée à la région du projet
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Producteur modifié         |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.* |

    Scénario: Impossible de modifier le producteur avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et la dreal "Dreal du nord" associée à la région du projet
        Quand le DGEC validateur modifie le producteur avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    Scénario: Impossible de modifier le producteur d'un projet éliminé
        Etant donné le projet éliminé "Du bouchon lyonnais"
        Quand le DGEC validateur modifie le producteur du projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
