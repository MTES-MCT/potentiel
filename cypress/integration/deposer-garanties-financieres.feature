# language: fr
Fonctionnalité: Transmettre de l'attestation des garanties financières

  @porteur-projet
  Scénario: Transmettre mon attestation de GF
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe | notifiedOn | garantieFinanciereSubmittedOn |
      | projet 1  | Classé | 1234       | 0                             |
    Lorsque je me rends sur la page du projet "projet 1"
    Et que je click sur le bouton "Transmettre l'attestation"
    Et que je saisis la valeur "20/05/2020" dans le champ "date"
    Lorsque je choisis un fichier dans le champ pièce-jointe
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Votre constitution de garanties financières a bien été enregistrée."
    Et je vois que l'étape "Constitution des garanties financières" de la frise est validée
    Et l'étape a été enregistrée dans l'historique du projet