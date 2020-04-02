# language: fr
Fonctionnalité: S'identifier sur son compte

  Scénario: L'utilisateur est un porteur de projet
    Etant donné que je suis sur la page d'identification
    Lorsque je saisis "porteur-projet@test.test" dans le champ email
    Et que je saisis "test" dans le champ mot de passe
    Et que je valide le formulaire
    Alors le site me redirige vers la page d'accueil de mon compte porteur de projet