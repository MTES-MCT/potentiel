# language: fr
@achèvement
@consulter-projet-pour-achèvement
Fonctionnalité: Consulter les données projet avant son achèvement

    Scénario: Consulter les données d'un projet dont l'achèvement n'a pas été initié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Alors les données d'un projet lauréat devrait être consultable avec :
            | statut                | actif |
            | achèvement en attente | non   |

    Scénario: Consulter les données d'un projet dont l'achèvement a été initié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et l'achèvement réel initié pour le projet lauréat
        Alors les données d'un projet lauréat devrait être consultable avec :
            | statut                | actif |
            | achèvement en attente | oui   |

    Scénario: Consulter les données d'un projet dont l'achèvement a été initié puis achevé par le cocontractant
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et l'achèvement réel initié pour le projet lauréat
        Et une date d'achèvement réel transmise pour le projet lauréat
        Alors les données d'un projet lauréat devrait être consultable avec :
            | statut                | achevé |
            | achèvement en attente | non    |

    Scénario: Consulter les données d'un projet
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et une demande d'abandon accordée pour le projet lauréat
        Alors les données d'un projet lauréat devrait être consultable avec :
            | statut                | abandonné |
            | achèvement en attente | non       |

    Scénario: Consulter les données d'un projet
        Alors les données d'un projet lauréat inexistant ne devraient pas être consultable
