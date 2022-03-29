# Bundles javascript "front"

Le html des pages est généré coté serveur avant d'être transmis comme réponse au front.

Afin de rajouter de l'interactivité dans le navigateur, un bundle javascript est chargé sur la page. Ce bundle "hydrate" la page, c'est à dire que le code React prend le contrôle du DOM afin de lui attacher des listeners et ainsi ajouter du comportement.

Ces bundles sont générés par webpack dont la configuration se situe dans [webpack.config.js](../webpack.config.js).

Un bundle est créé par page. Pour cela, la page doit se situer dans [src/views/pages](../src/views/pages) et avoir un nom qui termine par `Page.tsx` si c'est un fichier, ou `Page` si c'est un dossier.  
*NB: Il est possible de tweaker cette règle en modifiant [webpack.config.js](../webpack.config.js).*

## Optimisation du bundle

Webpack détermine ce qu'il faut inclure dans le bundle en regardant les imports. Si cette analyse n'est pas faite correctement, il est possible d'embarquer des choses inutiles et de se retrouver avec un bundle énorme.

### Analyse de bundle avec Statoscope
[Statoscope](https://github.com/statoscope/statoscope/tree/master/packages/webpack-plugin) est un utilitaire permet de voir ce qui est inclus dans le bundle (et pourquoi)

```bash
npm install @statoscope/webpack-plugin
```

puis ajouter dans webpack.config.js
```js
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

module.exports = {
  // ...
  plugins: [
    //...
    new StatoscopeWebpackPlugin()
  ],
  // ...
}
```

Ensuite, il suffit de faire `npm run build:front` et une page web avec un rapport s'ouvrira.

### Réglage Webpack

[Cette page](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) parle de comment on peut améliorer les choses.

Ajouter `"sideEffects": false` dans le `package.json` aide beaucoup pour la taille du bundle.