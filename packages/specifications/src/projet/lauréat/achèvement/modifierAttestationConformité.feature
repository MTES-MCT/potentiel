# language: fr
@achèvement
Fonctionnalité: Modifier une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le porteur modifie l'attestation de conformité
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur modifie l'attestation de conformité
        Alors l'achèvement du projet devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification de l'attestation de conformité |
            | nom_projet | Du boulodrome de Marseille                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                           |
        Et un email a été envoyé à au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification de l'attestation de conformité |
            | nom_projet | Du boulodrome de Marseille                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                           |

    Scénario: Impossible de modifier une attestation de conformité si le projet n'est pas achevé
        Quand le porteur modifie l'attestation de conformité
        Alors le porteur devrait être informé que "Le projet n'est pas achevé"

    Scénario: Impossible de modifier une attestation de conformité si l'attestation de conformité n'est pas transmise
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le porteur modifie l'attestation de conformité
        Alors le porteur devrait être informé que "L'attestation de conformité n'est pas transmise"

    Scénario: Impossible de modifier une attestation de conformité si la mainlevée des garanties financières est accordée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières accordée
        Quand le porteur modifie l'attestation de conformité
        Alors le porteur devrait être informé que "La mainlevée des garanties financières est accordée"
