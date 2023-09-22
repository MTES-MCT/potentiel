#Language: fr-FR
Fonctionnalité: Déclarer le gestionnaire de réseau d'un projet
    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet "Du boulodrome de Marseille"

    Scénario: Le gestionnaire de réseau est déclaré pour le projet lorsque la première demande de raccordement est transmise
        Quand un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau "Enedis" pour le projet "Du boulodrome de Marseille"
        Alors le projet "Du boulodrome de Marseille" devrait avoir comme gestionnaire de réseau "Enedis"