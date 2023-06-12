#Language: fr-FR
Fonctionnalité: Transmettre une proposition technique et financière

@working
    Scénario: Un porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur de projet transmet une proposition technique et financière
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement
@working
    Scénario: Impossible de transmettre une proposition technique et financière pour un projet sans dossier de raccordement
        Quand un administrateur transmet une proposition technique et financière pour un projet n'ayant aucun dossier de raccordement
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé"
@working
    Scénario: Impossible de transmettre une proposition technique et financière pour un dossier de raccordement non référencé
        Etant donné un dossier de raccordement
        Quand un administrateur transmet une proposition technique et financière pour un dossier de raccordement non référencé
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 
