# language: fr
Fonctionnalité: Je peux donner inviter un administrateur DREAL

  @admin
  Scénario: J'invite un administrateur qui n'a pas de compte
    Etant donné le projet suivant
      | nomProjet | regionProjet | garantiesFinancieresSubmittedOn | garantiesFinancieresDate | garantiesFinancieresFile |
      | projet 1  | Corse        | 1590618495128                   | 1590618495128            | test.pdf                 |
      | projet 2  | Corse        | 0                               | 0                        |                          |
      | projet 3  | Bretagne     | 1590618495128                   | 1590618495128            | test.pdf                 |
    Lorsque je me rends sur la page de gestion des DREAL
    Et que je saisis la valeur "admin@dreal.test" dans le champ "email"
    Et que je sélectionne "Corse" dans le menu déroulant "region"
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Une invitation a bien été envoyée à admin@dreal.test"
    Et "admin@dreal.test" reçoit un mail de notification avec un lien d'invitation
    # Et "admin@dreal.test" apparait dans la liste des dreal invitées pour "Corse"
    Lorsque je me déconnecte
    Et que je click sur le lien d'invitation reçu dans le mail de notification
    Alors je suis dirigé vers la page de création de compte
    Lorsque je remplis mon mot de passe
    Et que je saisis la valeur "admin-autre@dreal.test" dans le champ "email"
    Et que je valide le formulaire
    Alors je suis dirigé vers la page qui liste les garanties financières
    Et le projet "projet 1" se trouve dans la liste
    Et le projet "projet 2" ne se trouve pas dans la liste
    Et le projet "projet 3" ne se trouve pas dans la liste
# Lorsque je me déconnecte
# Et que je me connecte en tant qu'admin
# Et que je me rends sur la page de gestion des DREAL
# Alors "admin@dreal.test" apparait dans la liste des dreal inscrites pour "Corse"