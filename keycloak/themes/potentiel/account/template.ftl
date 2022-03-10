<#macro mainLayout active bodyClass>
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/WebPage" lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="${url.resourcesPath}/dsfr/dsfr.min.css">
  
    <meta name="theme-color" content="#000091"><!-- Défini la couleur de thème du navigateur (Safari/Android) -->
    <link rel="apple-touch-icon" href="${url.resourcesPath}/favicon/apple-touch-icon.png"><!-- 180×180 -->
    <link rel="icon" href="${url.resourcesPath}/favicon/favicon.svg" type="image/svg+xml">
    <link rel="shortcut icon" href="${url.resourcesPath}/favicon/favicon.ico" type="image/x-icon"><!-- 32×32 -->
    <link rel="manifest" href="${url.resourcesPath}/favicon/manifest.webmanifest" crossorigin="use-credentials">
    <!-- Modifier les chemins relatifs des favicons en fonction de la structure du projet -->
    <!-- Dans le fichier manifest.webmanifest aussi, modifier les chemins vers les images -->

    <title>Mon compte - Potentiel</title>
  </head>

  <body>
    <header role="banner" class="fr-header">
      <div class="fr-header__body">
        <div class="fr-container">
          <div class="fr-header__body-row">
            <div class="fr-header__brand fr-enlarge-link">
              <div class="fr-header__brand-top">
                <div class="fr-header__logo">
                  <p class="fr-logo">
                    République
                    <br />Française
                  </p>
                </div>
                <div class="fr-header__navbar">
                  <button
                    class="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls="modal-833"
                    aria-haspopup="menu"
                    title="Menu"
                    id="fr-btn-menu-mobile"
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div class="fr-header__service">
                <a href="${properties.potentielUrl}" title="Accueil - Potentiel - Ministère de la transition écologique">
                  <p class="fr-header__service-title">Potentiel</p>
                </a>
                <p class="fr-header__service-tagline">
                  Facilite le parcours des producteurs d'énergies renouvelables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Navigation principale -->
      <div
        class="fr-header__menu fr-modal"
        id="modal-833"
        aria-labelledby="fr-btn-menu-mobile"
      >
        <div class="fr-container">
          <button class="fr-link--close fr-link" aria-controls="modal-833">
            Fermer
          </button>
          <div class="fr-header__menu-links"></div>
          <nav
            class="fr-nav"
            id="navigation-832"
            role="navigation"
            aria-label="Menu principal"
          >
            <ul class="fr-nav__list">
              <li class="fr-nav__item">
                <a class="fr-nav__link" href="${properties.potentielUrl}/go-to-user-dashboard" target="_self">
                  <span class="fr-fi-arrow-left-line" aria-hidden="true"></span> Retourner sur Potentiel
                </a>
              </li>
              <li class="fr-nav__item">
                <a class="fr-nav__link" href="${url.accountUrl}" target="_self" <#if active=='account'>aria-current="page"</#if>>${msg("account")}</a>
              </li>
              <#if features.passwordUpdateSupported>
              <li class="fr-nav__item">
                <a class="fr-nav__link" href="${url.passwordUrl}" target="_self" <#if active=='password'>aria-current="page"</#if>>${msg("password")}</a>
              </li>
              </#if>
              <li class="fr-nav__item">
                <a class="fr-nav__link" href="${url.totpUrl}" target="_self" <#if active=='totp'>aria-current="page"</#if>>${msg("authenticator")}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main role="main">
      <div class="fr-container fr-py-6w">
        <section>
          <#nested "content">
        </section>
      </div>
    </main>
    
    <footer class="fr-footer" role="contentinfo" id="footer">
      <div class="fr-container">
        <div class="fr-footer__body">
          <div class="fr-footer__brand fr-enlarge-link">
            <a href="/" title="Retour à l’accueil">
              <p class="fr-logo" title="république française">
                Ministère<br />
                de la transition<br />
                écologique
              </p>
            </a>
          </div>
          <div class="fr-footer__content">
            <p class="fr-footer__content-desc">
              Suivez efficacement vos projets :<br />
              Transmettez vos documents, demandez des modifications.
            </p>
            <ul class="fr-footer__content-list">
              <li class="fr-footer__content-item">
                <a class="fr-footer__content-link" href="https://legifrance.gouv.fr"
                  >legifrance.gouv.fr</a
                >
              </li>
              <li class="fr-footer__content-item">
                <a class="fr-footer__content-link" href="https://gouvernement.fr"
                  >gouvernement.fr</a
                >
              </li>
              <li class="fr-footer__content-item">
                <a class="fr-footer__content-link" href="https://service-public.fr"
                  >service-public.fr</a
                >
              </li>
              <li class="fr-footer__content-item">
                <a class="fr-footer__content-link" href="https://data.gouv.fr"
                  >data.gouv.fr</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="fr-footer__bottom">
          <ul class="fr-footer__bottom-list">
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="#">Plan du site</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="#"
                >Accessibilité: non conforme</a
              >
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/cgu">Mentions légales</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel">Guide d'utilisation</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://potentiel.beta.gouv.fr/stats.html">Statistiques</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/cgu#cookies">Gestion des cookies</a>
            </li>
          </ul>
          <div class="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les contenus de ce site sont sous
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                target="_blank"
                >licence etalab-2.0</a
              >
            </p>
          </div>
        </div>
      </div>
    </footer>

    <script type="module" src="${url.resourcesPath}/dsfr/dsfr.module.min.js"></script>
    <script type="text/javascript" nomodule src="${url.resourcesPath}/dsfr/dsfr.nomodule.min.js"></script>
  </body>
</html>
</#macro>