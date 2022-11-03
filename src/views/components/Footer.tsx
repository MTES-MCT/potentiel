import React from 'react'

const Footer = () => {
  return (
    <div className="mt-auto">
      <footer
        className="pt-10 border-0 border-t-2 border-solid border-blue-france-sun-base"
        role="contentinfo"
        id="footer"
        style={{
          fontFamily: 'Marianne, arial, sans-serif',
        }}
      >
        <div className="w-full px-4 mx-auto dsfr-breakpoint-992:px-6 lg:max-w-[78rem]">
          <div className="flex flex-row flex-wrap items-center mb-4 md:mb-6">
            <div className="flex flex-row items-center basis-full md:p-4 md:-m-[1rem] md:mr-0 md:basis-auto basis">
              <a
                href="/"
                title="Retour à l’accueil"
                className="no-underline hover:no-underline visited:no-underline outline-0"
              >
                <div className="lg:mb-1 logo-before" />
                <div
                  className="m-0 font-bold tracking-tighter text-black uppercase text-[17px] md:text-[21px] leading-5"
                  title="Ministère de la transition énergétique"
                >
                  Ministère
                  <br />
                  de la transition
                  <br />
                  énergétique
                </div>
                <div className="logo-after" />
              </a>
            </div>
            <div className="flex flex-wrap basis-full mt-6 md:ml-auto dsfr-breakpoint-992:mt-0 dsfr-breakpoint-992:basis-1/2">
              <p className="text-sm leading-6 mt-0 mb-2">
                Suivez efficacement vos projets :<br />
                Transmettez vos documents, demandez des modifications.
              </p>
              <ul className="p-0 m-0 list-none flex flex-wrap self-center">
                <li className="mr-4 mt-2 mb-2 dsfr-breakpoint-576:mr-6">
                  <a
                    className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                    href="https://legifrance.gouv.fr"
                  >
                    legifrance.gouv.fr
                  </a>
                </li>
                <li className="mr-4 mt-2 mb-2 dsfr-breakpoint-576:mr-6">
                  <a
                    className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                    href="https://gouvernement.fr"
                  >
                    gouvernement.fr
                  </a>
                </li>
                <li className="mr-4 mt-2 mb-2 dsfr-breakpoint-576:mr-6">
                  <a
                    className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                    href="https://service-public.fr"
                  >
                    service-public.fr
                  </a>
                </li>
                <li className="mr-4 mt-2 mb-2 dsfr-breakpoint-576:mr-6">
                  <a
                    className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                    href="https://data.gouv.fr"
                  >
                    data.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center border-0 border-t border-solid border-gray-400">
            <ul className="p-0 m-0 list-none w-full flex flex-wrap items-center px-0 pt-2 pb-4">
              <li className="text-xs ">
                <span className="text-grey-425-base">Accessibilité: non conforme</span>
              </li>
              <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-425-base before:mr-3">
                <a
                  className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                  href="https://docs.potentiel.beta.gouv.fr/info/cgu"
                >
                  Mentions légales
                </a>
              </li>
              <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-425-base before:mr-3">
                <a
                  className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
                >
                  Guide d'utilisation
                </a>
              </li>
              <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-425-base before:mr-3">
                <a
                  className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                  href="https://potentiel.beta.gouv.fr/stats.html"
                >
                  Statistiques
                </a>
              </li>
              <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-425-base before:mr-3">
                <a
                  className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                  href="https://docs.potentiel.beta.gouv.fr/info/cgu#cookies"
                >
                  Gestion des cookies
                </a>
              </li>
              <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-425-base before:mr-3">
                <span className="text-grey-425-base">
                  Version {process.env.npm_package_version}
                </span>
              </li>
            </ul>
            {/* <div className="mt-2"> */}
            <p className="text-xs text-grey-425-base mt-2 mb-4">
              Sauf mention contraire, tous les contenus de ce site sont sous{' '}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                target="_blank"
                className="text-grey-425-base underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
              >
                licence etalab-2.0
              </a>
            </p>
            {/* </div> */}
          </div>
        </div>
      </footer>
    </div>
  )
}

export { Footer }
