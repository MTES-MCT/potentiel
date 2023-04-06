#language: fr-FR
Fonctionnalité: Réceptionner une demande de raccordement

    Scénario: Un gestionnaire de réseau réceptionne une demande complète de raccordement 
        Etant donné une demande complète de raccordement déposée par un porteur
        Quand le gestionnaire de réseau réceptionne la demande de raccordement avec :
        | La date de reception                     | 28/10/2022         |
        | L'identifiant du dossier de raccordement | OUE-RP-2022-000033 |
        Alors la demande de raccordement devrait être considérée comme complète à la date du "28/10/2022"

