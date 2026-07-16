# language: fr
@achèvement
Fonctionnalité: Corriger la date d'achèvement réel

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le Cocontractant corrige la date d'achèvement réel du projet lauréat
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le Cocontractant corrige la date d'achèvement réel pour le projet lauréat avec :
            | date d'achèvement | 2025-11-20 |
        Alors la date d'achèvement réel "2025-11-20" devrait être consultable pour le projet lauréat

    Scénario: Impossible de corriger la date d'achèvement d'un projet lauréat inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le Cocontractant corrige la date d'achèvement réel pour le projet éliminé avec :
            | date d'achèvement | 2025-11-20 |
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de corriger la date d'achèvement d'un projet lauréat qui n'est pas achevé
        Quand le Cocontractant corrige la date d'achèvement réel pour le projet lauréat avec :
            | date d'achèvement | 2025-11-20 |
        Alors l'utilisateur devrait être informé que "Le projet n'est pas achevé"

    Scénario: Impossible de corriger la date d'achèvement avec une date antérieure à la date de notification du projet
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le Cocontractant corrige la date d'achèvement réel pour le projet lauréat avec :
            | date d'achèvement | 2023-01-01 |
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être antérieure à la date de notification du projet"

    Scénario: Impossible de corriger la date d'achèvement avec une date future
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le Cocontractant corrige la date d'achèvement réel pour le projet lauréat avec :
            | date d'achèvement | 2050-09-01 |
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être dans le futur"

    Scénario: Impossible de corriger la date d'achèvement si aucune modification n'est transmise
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le Cocontractant corrige la date d'achèvement réel avec la même date
        Alors l'utilisateur devrait être informé que "Aucune modification n'a été transmise"
