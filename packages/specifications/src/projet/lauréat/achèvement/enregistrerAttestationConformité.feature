# language: fr
@achèvement
Fonctionnalité: Enregistrer une attestation de conformité avec son rapport associé

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Alors l'achèvement réel du projet devrait être consultable

    Scénario: Impossible d'enregistrer une attestation de conformité avec son rapport associé si le projet n'est pas achevé
        Quand le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Alors le porteur devrait être informé que "Le projet n'est pas achevé"

    Scénario: Impossible d'enregistrer une attestation de conformité avec son rapport associé si le projet a déjà une attestation de conformité transmise
        Etant donné l'achèvement réel transmis pour le projet lauréat
        Quand le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Alors le porteur devrait être informé que "Une attestation de conformité est déjà présente pour ce projet"

    Scénario: Impossible d'enregistrer une attestation de conformité avec son rapport associé si le projet a déjà une attestation de conformité enregistrée
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Et une attestation de conformité enregistrée avec son rapport associé pour le projet lauréat
        Quand le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Alors le porteur devrait être informé que "Une attestation de conformité est déjà présente pour ce projet"

    Scénario: Impossible d'enregistrer une attestation de conformité avec son rapport associé si le projet a déjà une attestation de conformité transmise par modification
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Et une attestation de conformité modifiée pour le projet lauréat
        Quand le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat
        Alors le porteur devrait être informé que "Une attestation de conformité est déjà présente pour ce projet"
