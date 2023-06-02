<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false showAnotherWayIfPresent=true>
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/WebPage" lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow">

    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Potentiel - Suivi des Projets d'Energies Renouvelables</title>

    <link href="${url.resourcesPath}/css/main.min.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/dsfr.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/potentiel.css" rel="stylesheet" />
    <link href="${url.resourcesPath}/css/tailwind.css" rel="stylesheet" />

    <meta name="theme-color" content="#000091" />
    <!-- Défini la couleur de thème du navigateur (Safari/Android) -->
    <link rel="apple-touch-icon" href="${url.resourcesPath}/dsfr/favicon/apple-touch-icon.png" />
    <!-- 180×180 -->
    <link rel="icon" href="${url.resourcesPath}/dsfr/favicon/favicon.svg" type="image/svg+xml" />
    <link rel="shortcut icon" href="${url.resourcesPath}/dsfr/favicon/favicon.ico" type="image/x-icon" />
    <!-- 32×32 -->
    <link rel="manifest" href="${url.resourcesPath}/dsfr/favicon/manifest.webmanifest" crossorigin="use-credentials" />
  </head>

  <body style="min-height: 100vh; display: flex; flex-direction: column;">
    <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;">
      <symbol viewBox="0 0 24 24" id="ri-question-line">
        <g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z"/>
        </g>
      </symbol>
      <symbol viewBox="0 0 24 24" id="ri-external-link-line">
        <g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"/>
        </g>
      </symbol>
    </svg>

    <header
      class="relative"
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

            <a class="ml-2 lg:ml-8 no-underline" style="color: black" href="${properties.potentielUrl}">
              <div class="font-bold lg:text-xl">Potentiel</div>
              <div class="hidden lg:block text-base">
                Facilite le parcours des producteurs
                <br />
                d'énergies renouvelables électriques
              </div>
            </a>

            <div class="flex flex-row ml-auto">
              <ul
                class="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 lg:mr-0"
              >
                <li>
                  <a
                    class="no-underline flex flex-row items-center px-2 md:px-3"
                    style="color: #000091"
                    target="_blank"
                    rel="noopener"
                    href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                  >
                    
                    <svg class="lg:hidden" height="1em" width="1em" style="fill: #000091">
                      <use xlink:href="#ri-question-line"></use>
                    </svg>
                    <span class="hidden lg:block pt-0.5 mx-1">Aide</span>
                    <svg class="hidden lg:block" height="1em" width="1em" style="fill: #000091">
                      <use xlink:href="#ri-external-link-line"></use>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
    </div>
    </header>

    <main role="main">
      <section class="section section-grey" style="min-height: calc(100vh - 400px)">
        <div class="container">
          <#--  <#nested "header">  -->
          <#nested "form">
          <#nested "info">

        </div>
      </section>
    </main>
    <div class="only-dsfr" style="margin-top: auto;">
      <footer class="fr-footer" role="contentinfo" id="footer">
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
                <span class="fr-footer__bottom-link" >Accessibilité: non conforme</span>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link" href="https://docs.potentiel.beta.gouv.fr/info/cgu">Mentions légales</a>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link"
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel">Guide d'utilisation</a>
              </li>
              <li class="fr-footer__bottom-item">
                <a class="fr-footer__bottom-link" href="https://potentiel.beta.gouv.fr/stats.html">Statistiques</a>
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
