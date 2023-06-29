#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le projet "Du boulodrome de Marseille"

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille"
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec le gestionnaire "Arc Energies Maurienne"
        Alors le projet "Du boulodrome de Marseille" devrait avoir comme gestionnaire de réseau "Arc Energies Maurienne"

    Scénario: Impodssible de modifier le gestionnaire de réseau d'un projet avec un gestionnaire non référencé
        Etant donné une demande complète de raccordement transmise auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille"
        Quand un porteur modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

