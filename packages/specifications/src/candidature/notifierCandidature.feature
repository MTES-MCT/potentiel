# language: fr
@candidature
@select
Fonctionnalité: Notifier une candidature d'un appel d'offres, suite à la notification d'une période

    Plan du Scénario: Notifier un candidat lauréat
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mis à jour
        Et le fournisseur devrait être mis à jour
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et l'attestation de désignation de la candidature devrait être consultable

        Exemples:
            | Appel d'offre                     | Période |
            | CRE4 - Bâtiment                   | 10      |
            | CRE4 - Sol                        | 10      |
            | CRE4 - Innovation                 | 3       |
            | CRE4 - ZNI                        | 2       |
            | CRE4 - Autoconsommation métropole | 10      |
            | CRE4 - Autoconsommation ZNI       | 2       |
            | Eolien                            | 6       |
            | PPE2 - Sol                        | 1       |
            | PPE2 - Eolien                     | 1       |
            | PPE2 - Bâtiment                   | 1       |
            | PPE2 - Neutre                     | 1       |
            | PPE2 - Innovation                 | 1       |
            | PPE2 - Autoconsommation métropole | 1       |
            | PPE2 - ZNI                        | 1       |

    Scénario: Notifier un candidat lauréat PPE2 - Petit PV Bâtiment
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment         |
            | période                                  | 1                                |
            | puissance de site                        | 153                              |
            | installateur                             | Installeur.INC                   |
            | installation avec dispositif de stockage | oui                              |
            | type de nature de l'exploitation         | vente-avec-injection-en-totalité |
            | type GF                                  | consignation                     |
        Et des garanties financières déposées avec la candidature
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet lauréat devrait être consultable
        Et le producteur du projet lauréat devrait être mis à jour
        Et la puissance du projet lauréat devrait être mise à jour
        Et l'actionnaire du projet lauréat devrait être mis à jour
        Et le fournisseur devrait être mis à jour
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et l'installation du projet lauréat devrait être mise à jour
        Et le dispositif de stockage du projet lauréat devrait être mise à jour
        Et la nature de l'exploitation du projet lauréat devrait être mise à jour
        Et les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Notifier un candidat éliminé
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature éliminée
        Alors le projet éliminé devrait être consultable
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Impossible de notifier une candidature déjà notifiée
        Etant donné le projet lauréat "Boulodrome de Lyon"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La candidature est déjà notifiée"

    Scénario: Impossible de notifier une candidature sans fonction pour le validateur
        Etant donné le DGEC Validateur sans fonction
        Et la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "La fonction de l'utilisateur doit être précisée pour cette opération"

    Scénario: Impossible de notifier une candidature sans nom pour le validateur
        Etant donné le DGEC Validateur sans nom
        Et la candidature lauréate "Du boulodrome de Paris"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le DGEC validateur devrait être informé que "Le nom de l'utilisateur doit être précisé pour cette opération"
