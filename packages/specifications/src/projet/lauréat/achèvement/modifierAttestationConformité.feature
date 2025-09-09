# language: fr
@achèvement
Fonctionnalité: Modifier une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Centrale PV"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur modifie une attestation de conformité
        Et une attestation de conformité transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat
        Alors une attestation de conformité devrait être consultable pour le projet lauréat

    Scénario: Impossible de modifier une attestation de conformité si la date de transmission au co-contractant est dans le futur
        Et une attestation de conformité transmise pour le projet lauréat
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat avec :
            | date transmission au co-contractant | 2040-01-01 |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"

    Scénario: Impossible de modifier une attestation de conformité si le projet n'a pas d'attestation de conformité à modifier
        Quand l'admin modifie l'attestation de conformité pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune attestation de conformité à modifier n'a été trouvée"
