import React from 'react';
import routes from '../../../../routes';

import { Link } from '../..';

import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';

type FooterProps = {
  user?: UtilisateurReadModel;
};

const Footer: React.FC<FooterProps> = ({ user }) => (
  <div className="print:hidden mt-auto">
    <footer
      className="pt-10 border-0 border-t-2 border-solid border-blue-france-sun-base"
      id="pied-de-page"
    >
      <div className="px-4 mx-auto lg:px-6 lg:max-w-[78rem]">
        <div className="flex flex-row flex-wrap items-center mb-4 md:mb-6">
          <div className="flex flex-row items-center basis-full md:p-4 md:-m-[1rem] md:mr-0 md:basis-auto basis">
            <Link
              href="/"
              title="Retour à l’accueil"
              aria-label="Retour à l’accueil"
              className="no-underline focus:no-underline hover:no-underline visited:no-underline"
            >
              <div className="lg:mb-1 logo-before" />
              <div className="m-0 font-bold tracking-tighter text-black uppercase text-[17px] md:text-[21px] leading-5">
                Ministère
                <br />
                de l'économie
                <br />
                des finances
                <br />
                et de la souveraineté
                <br />
                industrielle et numérique
              </div>
              <div className="logo-after" />
            </Link>
          </div>
          <div className="flex flex-wrap basis-full mt-6 md:ml-auto lg:mt-0 lg:basis-1/2">
            <p className="text-sm leading-6 mt-0 mb-2">
              Suivez efficacement vos projets :<br />
              Transmettez vos documents, demandez des modifications.
            </p>
            <ul className="p-0 m-0 list-none flex flex-wrap self-center">
              <li className="mr-4 mt-2 mb-2 sm:mr-6">
                <a
                  className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                  href="https://legifrance.gouv.fr"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="mr-4 mt-2 mb-2 sm:mr-6">
                <a
                  className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                  href="https://gouvernement.fr"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="mr-4 mt-2 mb-2 sm:mr-6">
                <a
                  className="font-bold text-sm leading-6 text-black no-underline hover:text-black hover:underline hover:decoration-2"
                  href="https://service-public.fr"
                >
                  service-public.fr
                </a>
              </li>
              <li className="mr-4 mt-2 mb-2 sm:mr-6">
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
        <div className="mt-4 flex flex-wrap items-center border-0 border-t border-solid border-grey-925-base">
          <ul className="p-0 m-0 list-none w-full flex flex-wrap items-center px-0 pt-2 pb-4">
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href={routes.DECLARATION_ACCESSIBILITE}
              >
                Accessibilité: non conforme
              </a>
            </li>
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href="https://docs.potentiel.beta.gouv.fr/info/cgu"
              >
                Mentions légales
              </a>
            </li>
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href="https://docs.potentiel.beta.gouv.fr/info/conditions-generales-dutilisation"
              >
                Conditions générales d'utilisation
              </a>
            </li>
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href="https://docs.potentiel.beta.gouv.fr/info/vie-privee-et-politique-de-confidentialite"
              >
                Politique de confidentialité
              </a>
            </li>
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href={
                  user?.role === 'dreal'
                    ? 'https://potentiel.gitbook.io/guide-potentiel-dreal/ '
                    : 'https://docs.potentiel.beta.gouv.fr/'
                }
              >
                Guide d'utilisation
              </a>
            </li>
            <li className="text-xs ml-1 md:ml-3 before:inline-block before:content-[''] before:align-middle before:w-[1px] before:h-[16px] before:bg-grey-925-base before:mr-3">
              <a
                className="text-grey-425-base no-underline hover:text-grey-425-base hover:underline focus:text-grey-425-base visited:text-grey-425-base"
                href={routes.STATS}
              >
                Statistiques
              </a>
            </li>
          </ul>
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
        </div>
      </div>
    </footer>
  </div>
);

export { Footer };
