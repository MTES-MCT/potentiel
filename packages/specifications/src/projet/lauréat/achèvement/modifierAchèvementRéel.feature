# language: fr
@achèvement
Fonctionnalité: Modifier un achèvement réel

    Contexte:
        Etant donné le projet lauréat "Centrale PV"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal centrale" associée à la région du projet

    Scénario: Un admin modifie l'achèvement réel
        Etant donné l'achèvement réel transmis pour le projet lauréat
        Quand l'admin modifie l'achèvement réel du projet
        Alors l'achèvement réel du projet devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Centrale PV - Modification des informations d'achèvement |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                           |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Centrale PV - Modification des informations d'achèvement |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                           |

    Scénario: Un admin modifie une date d'achèvement réel sans joindre de pièce justificative
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand l'admin modifie l'achèvement réel du projet sans pièce justificative
        Alors l'achèvement réel du projet devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Centrale PV - Modification des informations d'achèvement |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                           |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Centrale PV - Modification des informations d'achèvement |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                           |

    Scénario: Impossible de modifier l'achèvement réel si la date de transmission au Cocontractant est dans le futur
        Etant donné l'achèvement réel transmis pour le projet lauréat
        Quand l'admin modifie l'achèvement réel du projet avec :
            | date transmission au Cocontractant | 2040-01-01 |
        Alors l'admin devrait être informé que "La date de transmission au Cocontractant ne peut pas être une date future"

    Scénario: Impossible de modifier l'achèvement réel si aucune modification n'est transmise
        Etant donné l'achèvement réel transmis pour le projet lauréat
        Quand l'admin modifie l'achèvement réel du projet avec les mêmes valeurs
        Alors l'admin devrait être informé que "Aucune modification n'a été transmise"

    Scénario: Impossible de modifier une date d'achèvement réel sans attestation si aucune modification n'est transmise
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand l'admin modifie l'achèvement réel du projet avec les mêmes valeurs
        Alors l'admin devrait être informé que "Aucune modification n'a été transmise"

    Scénario: Impossible de modifier l'achèvement réel si le projet n'est pas achevé
        Quand l'admin modifie l'achèvement réel du projet
        Alors l'admin devrait être informé que "Le projet n'est pas achevé"
