<#macro mainLayout active bodyClass>
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/WebPage" lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="${url.resourcesPath}/css/main.min.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/dsfr.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/potentiel.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/tailwind.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" />
  
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
    <header
      class="mb-4"
      style="
        font-family: Marianne, arial, sans-serif;
        box-shadow: 0 8px 8px 0 rgb(0 0 0 / 10%);
      "
    >
      <div class="p-2 lg:p-0 text-lg">
        <div class="flex flex-col xl:mx-auto xl:max-w-7xl">
          <section class="flex flex-row px-2 pb-1 lg:p-4 items-center">
            <div class="flex flex-col">
              <div class="lg:mb-1 logo-before"></div>
              <div
                class="hidden lg:block uppercase font-bold leading-none tracking-tighter"
              >
                République
                <br />
                Française
              </div>
              <div class="hidden lg:block logo-after"></div>
            </div>

            <div class="ml-2 lg:ml-8">
              <div class="font-bold lg:text-xl">Potentiel</div>
              <div class="hidden lg:block text-base">
                Facilite le parcours des producteurs
                <br />
                d'énergies renouvelables électriques
              </div>
            </div>

            <div class="flex flex-row ml-auto">
              <ul
                class="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 mr-6 lg:mr-0"
              >
                <li>
                  <a
                    class="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
                    href="${properties.potentielUrl}/logout"
                    style="color: #000091"
                  >
                    <i class="ri-logout-box-line"></i>
                    <span class="hidden lg:block pt-0.5 mx-1"
                      >Me déconnecter</span
                    >
                  </a>
                </li>
                <li>
                  <a
                    class="no-underline flex flex-row items-center px-2 md:px-3"
                    style="color: #000091"
                    target="_blank"
                    rel="noopener"
                    href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                  >
                    <i class="ri-question-line lg:hidden"></i>
                    <span class="hidden lg:block pt-0.5 mx-1">Aide</span>
                    <i class="hidden lg:block ri-external-link-line"></i>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div class="lg:border-0 lg:border-t lg:border-solid lg:border-slate-200">
          <section class="flex flex-col xl:mx-auto xl:max-w-7xl">
            <input id="menu-toggle" class="hidden" type="checkbox" />
            <label
              class="absolute top-2 right-2 text-xl lg:hidden"
              for="menu-toggle"
            >
              <i class="menu-open ri-menu-line"></i>
              <i class="menu-close hidden ri-close-line"></i>
            </label>
            <nav
              class="menu hidden lg:block absolute lg:relative top-8 lg:top-0 left-0 w-full h-full lg:h-auto z-50 bg-white lg:bg-transparent pt-6 lg:pt-0"
            >
              <ul
                class="flex flex-col list-none px-4 lg:px-0 py-2 lg:py-0 m-0 lg:flex-row lg:text-sm lg:font-normal"
              >
                <li class="pb-4 lg:p-4">
                  <a class="flex flex-row items-center no-underline text-black" href="${properties.potentielUrl}/go-to-user-dashboard">
                    <i class="ri-arrow-left-line mr-2"></i>
                    Retourner sur Potentiel
                  </a>
                </li>
                <li class="pb-4 lg:p-4">
                  <a class="no-underline text-black" href="${url.accountUrl}" target="_self" <#if active=='account'>aria-current="page"</#if>>${msg("account")}</a>
                </li>
                <#if features.passwordUpdateSupported>
                <li class="pb-4 lg:p-4">
                  <a class="no-underline text-black" href="${url.passwordUrl}" target="_self" <#if active=='password'>aria-current="page"</#if>>${msg("password")}</a>
                </li>
                </#if>
                <li class="pb-4 lg:p-4">
                  <a class="no-underline text-black" href="${url.totpUrl}" target="_self" <#if active=='totp'>aria-current="page"</#if>>${msg("authenticator")}</a>
                </li>
              </ul>
            </nav>
          </section>
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
      
      <footer class="fr-footer" role="contentinfo" id="footer">
        <div class="fr-container">
          <div class="fr-footer__body">
            <div class="fr-footer__brand fr-enlarge-link">
              <p class="fr-logo" title="république française">
                Ministère<br />
                de la transition<br />
                écologique
              </p>
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
    </div>
  </body>
</html>
</#macro>