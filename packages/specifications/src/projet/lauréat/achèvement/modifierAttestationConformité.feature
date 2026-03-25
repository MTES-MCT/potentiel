# language: fr
@achèvement
Fonctionnalité: Modifier une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Centrale PV"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un admin modifie une attestation de conformité
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat
        Alors l'achèvement du projet devrait être consultable

    Scénario: Un admin modifie une date d'achèvement sans attestation de conformité transmise
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat sans attestation de conformité transmise
        Alors l'achèvement du projet devrait être consultable

    Scénario: Impossible de modifier une attestation de conformité si la date de transmission au Cocontractant est dans le futur
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat avec :
            | date transmission au Cocontractant | 2040-01-01 |
        Alors l'admin devrait être informé que "La date de transmission au Cocontractant ne peut pas être une date future"

    Scénario: Impossible de modifier une attestation de conformité si aucune modification n'est transmise
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat avec les mêmes valeurs
        Alors l'admin devrait être informé que "Aucune modification n'a été transmise"

    Scénario: Impossible de modifier une date d'achèvement sans attestation si aucune modification n'est transmise
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat avec les mêmes valeurs
        Alors l'admin devrait être informé que "Aucune modification n'a été transmise"

    Scénario: Impossible de modifier une attestation de conformité si le projet n'est pas achevé
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat
        Alors l'admin devrait être informé que "Le projet n'est pas achevé"
