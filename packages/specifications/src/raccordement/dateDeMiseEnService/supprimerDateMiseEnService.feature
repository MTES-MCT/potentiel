# language: fr
@raccordement
@date-mise-en-service
Fonctionnalité: Supprimer le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors la mise en service du dossier de raccordement devrait être supprimée
        Et il ne devrait pas y avoir de mise en service dans le raccordement du projet lauréat

    Scénario: Impossible de supprimer la mise en service du dossier de raccordement si celui-ci n'est pas en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors l'utilisateur devrait être informé que "Le dossier de raccordement n'est pas en service"
