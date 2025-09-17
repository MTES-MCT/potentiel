# language: fr
@fournisseur
Fonctionnalité: Enregistrer un changement de fournisseur

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de fournisseur
        Quand le porteur enregistre un changement de fournisseur
        Alors le fournisseur devrait être mis à jour
        Et le changement enregistré du fournisseur du projet lauréat devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Enregistrement d'un changement de fournisseur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                       |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Enregistrement d'un changement de fournisseur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                       |

    Scénario: Impossible d'enregistrer un changement de fournisseur si l'AO ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Quand le porteur enregistre un changement de fournisseur
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    Scénario: Impossible d'enregistrer un changement de fournisseur sans modification
        Quand le porteur enregistre un changement de fournisseur sans modification
        Alors l'utilisateur devrait être informé que "Le changement de fournisseur doit contenir une modification"

    Scénario: Impossible d'enregistrer un changement de fournisseur avec une valeur d'évaluation carbone négative
        Quand le porteur enregistre un changement de fournisseur avec :
            | évaluation carbone | -1 |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone ne peut être négative"

    Scénario: Impossible d'enregistrer un changement de fournisseur avec une valeur d'évaluation carbone autre qu'un nombre
        Quand le porteur enregistre un changement de fournisseur avec :
            | évaluation carbone | hello |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit être un nombre"

    Scénario: Impossible d'enregistrer un changement de fournisseur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de fournisseur
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de faire un changement d'un projet lauréat si une demande d'abandon est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de fournisseur
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer le changement de fournisseur d'un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de fournisseur
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer le changement de fournisseur d'un projet lauréat dont le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Quand le porteur enregistre un changement de fournisseur
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
