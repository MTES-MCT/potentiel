import { Heading1 } from '@/components/atoms/headings';

export const PropositionDeValeur = () => (
  <section className="text-theme-white bg-theme-blueFrance">
    <div className="flex flex-col xl:mx-auto xl:max-w-5xl px-2 lg:px-4 p-6 gap-6 xl:pt-10">
      <div className="flex flex-col gap-1">
        <Heading1 className="m-0 font-semibold lg:pt-10 lg:text-4xl">
          <span className="leading-normal bg-dsfr-background-alt-blueFrance-default text-theme-blueFrance box-decoration-clone px-4 py-1">
            La plateforme de suivi des projets éoliens et photovoltaiques lauréats des appels
            d'offres de l'État.
          </span>
        </Heading1>
        <p className="text-lg font-medium leading-relaxed mt-4">
          Potentiel est un outil central des dispositifs de soutien aux énergies renouvelables
          électriques, <br className="hidden md:inline" />
          facilitant le parcours administratif des projets lauréats aux appels d'offres et
          produisant des données stratégiques <br className="hidden md:inline" />
          pour atteindre 40 % d’énergie renouvelable électriques en France d’ici 2030.
        </p>
      </div>
    </div>
  </section>
);
