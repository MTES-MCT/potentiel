# language: fr
@raccordement
@transmettre-date-mes
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Scénario: Le gestionnaire de réseau transmet une date de mise en service pour un dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le gestionnaire de réseau devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une date de mise en service pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le gestionnaire de réseau devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une date de mise en service dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2999-03-27 |
        Alors le gestionnaire de réseau devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de transmettre une date de mise en service antérieure à la date de notification du projet
        Etant donné le projet lauréat "Du boulodrome de Lille" avec :
            | date notification | 2022-10-26 |
        Et une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Alors le gestionnaire de réseau devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"

    Scénario: Impossible de transmettre une date de mise en service plus d'une fois
        Etant donné le projet lauréat "Du boulodrome de Lille" avec :
            | date notification | 2021-10-26 |
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Et le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Alors le gestionnaire de réseau devrait être informé que "La date de mise en service est déjà transmise pour ce dossier de raccordement"


# Cas impossibles à tester car il n'y a pas de DCR pour un projet éliminé ou abandonné
# Scénario: Impossible de transmettre une date de mise en service d'un projet lauréat abandonné
# Scénario: Impossible de transmettre une date de mise en service d'un projet éliminé