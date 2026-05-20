# language: fr
@raccordement
@statut-raccordement
Fonctionnalité: Réactiver le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

@select
    Scénario: Le signalement d'un PPA doit réactiver un raccordement désactivé par un abandon
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon accordée pour le projet lauréat
        Quand un utilisateur "dgec" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat   