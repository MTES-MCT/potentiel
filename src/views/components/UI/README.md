# Gestion des interfaces utilisateurs 
## Qu'est-ce que l'atomic design

L'atomic design est une philosophie qui permet un découpage modulaire d'une interface.  

Dans l'optique de concevoir des applications qui puissent garder une cohérence graphique et un comportement quel que soit le device qui l'utilise, l'idée est de repenser la manière dont on va découper une page.  
Le principe d'atomic design repose sur le fait de découper les élements qui composent l'interface du plus petit (atom) au plus gros (page).  

On peut donc envisager un découpage qui suit cette logique :  
1. Les **Atomes** : éléments graphiques de base d'une l'interface.  
   *Exemple : boutons, typographie, couleurs, icons...*

2. Les **Molécules** : Composées essentiellement d'atomes, elles forment les premiers éléments d'interface.
   *Exemple : Un bouton avec une couleur primaire et un libellé forment un bouton d’action*

3. Les **Organismes** : Composés essentiellement de molécules et potentiellement d'atomes.
   *Exemple : un champ de saisie et un bouton d’action forment l’organisme de publication de message.*

4. Les **Templates** : Ce sont des modèles de page, qui ne contiennent pas de contenu (*lorem ipsum*) ni d'assets. Leur intérêt repose sur le fait de pouvoir tester le comportement des interfaces d'un point de vue responsive.

5. Les **Pages** : Basé sur un template, il s'agit d'une interface qui va s'inscrire dans un parcours utilisateur

Références : 
- https://blog-ux.com/quest-ce-que-latomic-design/
- https://vimeo.com/109130093?embedded=true&source=vimeo_logo&owner=7270851

## Utilisation dans Potentiel

Pour Potentiel, nous appliquons le design atomic dans le dossier `UI` organisés entre les dossiers atoms et molecules.

Chaque composant dispose d'une story qui lui permet d'être consultable dans le storybook. 

Afin de pouvoir bien construire chacun de nos composants, nous utilisons certaines conventions : 
- Tout nos composants doivent être construit dans une logique [mobile-first](https://www.anthedesign.fr/webdesign-2/mobile-first/) qui garanti une bonne utilisation du composant quelque soit le device.
- Nous adoptons une approche de classe utilitaire à l'aide du framework [tailwindcss](https://tailwindcss.com/). En supplément, nous conseillons d'installer leur [extension](https://tailwindcss.com/docs/editor-setup) sur votre éditeur de code favori.

## Lien avec le design-system de l'état (DSFR)

L'état dispose d'un [système de design](https://www.systeme-de-design.gouv.fr/) (dsfr) visant à homogénéiser ses services d'état. Bien que nous n'utilisions pas directement le DSFR, nous nous efforçons de respecter les règles et design définis dans la [documentation](https://gouvfr.atlassian.net/wiki/spaces/DB/overview?homepageId=145359476)

