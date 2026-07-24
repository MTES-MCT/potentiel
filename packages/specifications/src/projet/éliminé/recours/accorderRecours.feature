# language: fr
@recours
Fonctionnalité: Accorder la demande de recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Sol |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: La dgec accorde le recours d'un projet éliminé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être accordé
        Et le projet lauréat devrait être consultable
        Et les garanties financières actuelles ne devraient pas être consultables
        Et le projet éliminé ne devrait plus être consultable
        Et des garanties financières devraient être attendues avec :
            | motif | recours-accordé |
        Et une tâche "rappel des garanties financières à transmettre" est planifiée pour le projet lauréat
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Recours accordé |
            | nom_projet | Du boulodrome de Marseille                               |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours       |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Recours accordé |
            | nom_projet | Du boulodrome de Marseille                               |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours       |
        Et un email a été envoyé à la cre avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Recours accordé |
            | nom_projet | Du boulodrome de Marseille                               |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours       |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Recours accordé |
            | nom_projet | Du boulodrome de Marseille                               |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours       |
        Mais aucun autre email n'a été envoyé
        Et l'attestation de désignation de la candidature ne devrait pas être régénérée

    Scénario: la dgec accorde le recours en instruction d'un projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être accordé
        Et le projet lauréat devrait être consultable
        Et le projet éliminé ne devrait plus être consultable
        Et des garanties financières devraient être attendues avec :
            | motif | recours-accordé |
        Et les garanties financières actuelles ne devraient pas être consultables

    Scénario: Impossible d'accorder le recours d'un projet éliminé avec une date d'accord dans le futur
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé avec :
            | date d'accord du recours | 2100-10-10 |
        Alors la dgec devrait être informé que "La date d'accord du recours ne peut pas être dans le futur"

    Scénario: Impossible d'accorder le recours d'un projet éliminé avec une date d'accord antérieure à la date de notification du projet
        Etant donné le projet éliminé "Du boulodrome de Paris" avec :
            | appel d'offres    | PPE2 - Sol |
            | date notification | 2023-01-01 |
        Et la dreal "Dreal de Paris" associée à la région du projet
        Et une demande de recours en cours pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé avec :
            | date d'accord du recours | 2022-10-10 |
        Alors la dgec devrait être informé que "La date d'accord du recours ne peut pas antérieure à la date de notification du projet"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné une demande de recours accordée pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors la dgec devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné une demande de recours rejetée pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors la dgec devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors la dgec devrait être informé que "Aucun recours n'est en cours"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été annulé
        Etant donné une demande de recours annulée pour le projet éliminé
        Quand la dgec accorde le recours pour le projet éliminé
        Alors la dgec devrait être informé que "Le recours a déjà été annulé"
