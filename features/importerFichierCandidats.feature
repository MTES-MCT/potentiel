# language: fr
Fonctionnalité: Import d'un fichier de candidats

  Scénario: Fichier au bon format
    Etant donné que je suis un administrateur DGEC
    Et que je suis sur la page d'import de candidats
    Lorsque je saisis la période 'Période 3T Batiment'
    Et que je selectionne le fichier csv de la forme
      """
      numeroCRE;famille;nomCandidat;nomProjet;puissance(kWc);prixReference(euros/MWh);evaluationCarbone(kg eq CO2/kWc);note;nomRepresentantLegal;email;adresseProjet;codePostalProjet;communeProjet;departementProjet;regionProjet;classé(1/0);motifsElimination
      456851;1;Soleillou SARL;Lavandou 3000;12000;60,45;450,25;3,4;Michel Legrand;michel@soleillou.eu;3 chemin du Prat;23258;Lavandou;Ariège;PACA;Classé;
      75432;2;PV Power SA;SRE-2;1500;80,99;150,00;1,1;Raymond Patoulachi;rayray@lesgaufres.fr;3 rue Paster;69380;Chasselay;Rhône;Rhone-Alpes-Auvergne;Eliminé;Puissance trop faible
      """
    Et que je valide le formulaire
    Alors le site me redirige vers la page de liste des projets
    Et me notifie la réussite par "Les candidats ont bien été importés."


  Scénario: Fichier au mauvais format
    Etant donné que je suis un administrateur DGEC
    Et que je suis sur la page d'import de candidats
    Lorsque je saisis la période 'Période 3T Batiment'
    Et que je selectionne le fichier csv de la forme
      """
      mauvaiseColonne;etEncoreMauvais
      1;3
      """
    Et que je valide le formulaire
    Alors le site reste sur la page d'import de candidats
    Et me notifie l'échec par "Format du fichier erroné (vérifier conformité des colonnes)"