# language: fr
Fonctionnalité: Supprimer le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le Gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors la mise en service du dossier de raccordement devrait être supprimée

    Scénario: Impossible de supprimer la mise en service du dossier de raccordement si celui-ci n'est pas en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le Gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors le gestionnaire de réseau devrait être informé que "Le dossier de raccordement n'est pas en service"
