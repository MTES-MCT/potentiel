# Metabase

Nous utilisons metabase pour faire des analyses en mode no-code sur la base de données.

Il s'agit d'un service autonome qui est déployé sur sa propre instance Clever Cloud et a sa propre base de données (pour la configuration). 

Metabase est connecté à la base de données de production via un utilisateur read-only.

## Déploiement / Mise à jour

Metabase tourne dans un conteneur de type Java. Le déploiement consiste simplement à déployer un fichier `metabase.jar`. L'instance clever cloud pointe sur ce fichier via la variable d'environnement `CC_JAR_PATH=./metabase.jar`.

1) Télécharger la dernière release sur https://github.com/metabase/metabase/releases
2) La placer dans un repo git vide et faire un commit
3) `clever deploy` (l'identifiant de l'app est disponible dans la console de clever cloud)

Nous n'avons pas de repository github partagé pour ce fichier. Clever cloud va sans doute se plaindre qu'il ne s'agit pas d'un fast-forward lors du déploiement. Pour forcer le déploiement, il faut rajouter `-f` (ie `clever deploy -f`).