<#macro mainLayout active bodyClass>
  <!doctype html>
  <html data-fr-js="true" lang="fr">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#000091" />
    <link rel="apple-touch-icon" href="${url.resourcesCommonPath}/favicon/apple-touch-icon.png" />
    <link rel="icon" href="${url.resourcesCommonPath}/favicon/favicon.svg" type="image/svg+xml" />
    <link rel="shortcut icon" href="${url.resourcesCommonPath}/favicon/favicon.ico" type="image/x-icon" />
    <link rel="manifest" href="${url.resourcesCommonPath}/favicon/manifest.webmanifest" crossorigin="use-credentials" />    
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico">
    <#if properties.stylesCommon?has_content>
      <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <script src="${url.resourcesCommonPath}/js/dsfr.module.min.js" type="module"></script>
    <script src="${url.resourcesCommonPath}/js/dsfr.nomodule.min.js" type="text/javascript"></script>
    <title>
      ${msg("accountManagementTitle")}
    </title>
  </head>
  <body class="admin-console user min-h-screen flex flex-col">
    <header role="banner" class="fr-header">
      <div class="fr-header__body">
        <div class="fr-container">
          <div class="fr-header__body-row">
            <div class="fr-header__brand fr-enlarge-link">
              <div class="fr-header__brand-top">
                <div class="fr-header__logo">
                  <p class="fr-logo">République <br>Française</p>
                </div>
                <div class="fr-header__navbar">
                  <button class="fr-btn--menu fr-btn" data-fr-opened="false" aria-controls="modal-499" aria-haspopup="menu" id="button-500" title="Menu">Menu</button>
                </div>
              </div>
              <div class="fr-header__service">
              <a href="${properties.potentielUrl}" title="Accueil - Potentiel - Ministère de la transition énergétique">
                <p class="fr-header__service-title">Potentiel</p>
              </a>
                <p class="fr-header__service-tagline">Facilite le parcours des producteurs<br />d'énergies renouvelables électriques</p>
              </div>
            </div>
            <div class="fr-header__tools">
              <div class="fr-header__tools-links">
                <ul class="fr-links-group">
                            <li class="fr-shortcuts__item">
                <a
                class="fr-link"
                  href="${properties.potentielUrl}/logout"
                >
                  <svg height="1em" width="1em" style="fill: #000091">
                    <use xlink:href="#ri-logout-box-r-line"></use>
                  </svg>  
                    Me déconnecter
                </a>
              </li>
                  <li>
                    <a class="fr-link" target="_blank" rel="noopener" href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel">Aide</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-header__menu fr-modal" id="modal-499" aria-labelledby="button-500">
        <div class="fr-container">
            <button class="fr-btn--close fr-btn" aria-controls="modal-499" title="Fermer">
                Fermer
            </button>
            <div class="fr-header__menu-links">
            </div>
            <nav class="fr-nav" id="navigation-494" role="navigation" aria-label="Menu principal">
              <ul class="fr-nav__list">
                <li class="fr-nav__item">
                  <a class="fr-nav__link  <#if active=='account'>text-blue-800 font-medium border-0 border-l-4 border-solid border-blue-800 lg:border-l-0 lg:border-b-2</#if>" href="${url.accountUrl}" target="_self" <#if active=='account'>aria-current="page"</#if>>${msg("account")}</a>
                </li>
                <#if features.passwordUpdateSupported>
                <li class="fr-nav__item">
                  <a class="fr-nav__link <#if active=='password'></#if>" href="${url.passwordUrl}" target="_self" <#if active=='password'>aria-current="page"</#if>>${msg("password")}</a>
                </li>
                </#if>
                <li class="fr-nav__item">
                  <a class="fr-nav__link <#if active=='totp'></#if>" href="${url.totpUrl}#top" target="_self" <#if active=='totp'>aria-current="page"</#if>>${msg("authenticator")}</a>
                </li>
              </ul>
            </nav>
        </div>
      </div>
    </header>
    <div class="only-dsfr">
      <main role="main">
        <div class="fr-container fr-py-6w">
          <section>
            <#nested "content">
          </section>
        </div>
      </main>
      <footer class="fr-footer mt-auto" role="contentinfo" id="footer">
        <div class="fr-container">
          <div class="fr-footer__body">
            <div class="fr-footer__brand fr-enlarge-link">
              <p class="fr-logo" title="république française">
                Ministère<br />
                de la transition<br />
                énergétique
              </p>
            </div>
            <div class="fr-footer__content">
              <p class="fr-footer__content-desc">
                Suivez efficacement vos projets :<br />
                Transmettez vos documents, demandez des modifications.
              </p>
              <ul class="fr-footer__content-list">
                <li class="fr-footer__content-item">
                  <a class="fr-footer__content-link" href="https://legifrance.gouv.fr">legifrance.gouv.fr</a>
                </li>
                <li class="fr-footer__content-item">
                  <a class="fr-footer__content-link" href="https://gouvernement.fr">gouvernement.fr</a>
                </li>
                <li class="fr-footer__content-item">
                  <a class="fr-footer__content-link" href="https://service-public.fr">service-public.fr</a>
                </li>
                <li class="fr-footer__content-item">
                  <a class="fr-footer__content-link" href="https://data.gouv.fr">data.gouv.fr</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="fr-footer__bottom">
            <ul class="fr-footer__bottom-list">
              <li class="fr-footer__bottom-item">
                <span class="fr-footer__bottom-link">Accessibilité: non conforme</span>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/cgu">Mentions légales</a>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link"
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel">Guide d'utilisation</a>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link" href="${properties.potentielUrl}/stats.html">Statistiques</a>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/cgu#cookies">Gestion des
                  cookies</a>
              </li>
            </ul>
            <div class="fr-footer__bottom-copy">
              <p>
                Sauf mention contraire, tous les contenus de ce site sont sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank">licence etalab-2.0</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </body>
  </html>
</#macro>