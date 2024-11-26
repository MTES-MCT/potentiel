# language: fr
Fonctionnalité: Transmettre une preuve de recandidature

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet lauréat
        Etant donné un abandon accordé avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade" ayant été notifié le "2024-01-01"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors la preuve de recandidature devrait être transmise pour le projet lauréat
        Et une tâche indiquant de "transmettre la preuve de recandidature" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet éliminé
        Etant donné un abandon accordé avec recandidature pour le projet lauréat
        Et le projet éliminé "MIOS" ayant été notifié le "2024-10-01"
        Quand le porteur transmet le projet éliminé "MIOS" comme preuve de recandidature suite à l'abandon du projet
        Alors la preuve de recandidature devrait être transmise pour le projet lauréat
        Et une tâche indiquant de "transmettre la preuve de recandidature" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible de transmettre si une preuve de recandidature a déjà été saisie
        Etant donné un abandon accordé avec recandidature avec preuve transmise pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "La preuve de recandidature a déjà été transmise"

    Scénario: Impossible de transmettre une preuve pour un abandon accordé sans recandidature
        Etant donné un abandon accordé pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve pour un abandon sans recandidature"

    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon rejeté
        Etant donné un abandon rejeté avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"

    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon confirmé
        Etant donné un abandon rejeté avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"

    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon en cours
        Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"

    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon à confirmer
        Etant donné une confirmation d'abandon demandée avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"

    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est antérieure au 15/12/2023
        Etant donné un abandon accordé avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade" ayant été notifié le "2023-12-14"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié avant le 15/12/2023"

    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est ultérieure au 31/03/2025
        Etant donné un abandon accordé avec recandidature pour le projet lauréat
        Et le projet lauréat "Boulodrome Sainte Livrade" ayant été notifié le "2025-04-01"
        Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet
        Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié après le 31/03/2025"

    @NotImplemented
    Scénario: Impossible de transmettre comme preuve de recandidature un projet inexistant
        Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur transmet le projet lauréat "projet inconnu" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
            | La date de notification du projet | 2024-01-01 |
        Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet inexistant"
