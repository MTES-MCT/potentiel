import Image from 'next/image';

import { Heading1 } from '@/components/atoms/headings';

export const PropositionDeValeur = () => (
  <section className="text-theme-white bg-theme-blueFrance">
    <div className="flex flex-col xl:mx-auto xl:max-w-5xl px-2 lg:px-4 p-6 gap-6 xl:pt-10">
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-4 gap-8 items-center">
          <Image
            src="/illustrations/proposition_valeur.png"
            alt=""
            aria-hidden
            priority
            className="w-full h-auto object-contain"
            width={300}
            height={300}
          />
          <Heading1 className="col-span-3 m-0 p-0 font-semibold">
            La plateforme de suivi des projets éoliens et photovoltaïques lauréats des appels
            d'offres de l'État.
          </Heading1>
        </div>
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
