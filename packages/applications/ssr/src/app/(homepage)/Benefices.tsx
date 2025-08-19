import Image from 'next/image';

const listeBenefices = [
  'Retrouvez vos projets',
  'Suivez-les étape par étape',
  'Gérez vos documents',
  'Signalez des changements',
  'Demandez des modifications',
  'Invitez vos collègues',
];

export const Benefices = () => (
  <section className="mb-10">
    <h2 className="text-theme-blueFrance text-3xl lg:text-4xl xl:text-5xl font-semibold pb-5 pt-10 px-4 text-center mb-0 md:mb-10">
      Producteurs d'énergies renouvelables électriques
    </h2>
    <div className="flex flex-col lg:flex-row xl:mx-auto xl:max-w-7xl px-2 lg:px-4">
      <Image
        className="flex-2 hidden md:block self-center w-full p-4 lg:w-3/5"
        src="/illustrations/enr-illustration.png"
        width={889}
        height={498}
        aria-hidden
        alt=""
      />
      <div className="text-theme-blueFrance bg-dsfr-background-alt-blueFrance-default lg:p-10 w-full lg:w-2/5">
        <ul className="flex flex-col text-lg xl:text-xl font-medium md:font-semibold w-fit md:mx-auto m-0 p-4">
          {listeBenefices.map((benefice) => (
            <li key={benefice} className="flex flex-row items-center leading-loose list-none">
              <Image
                src="/illustrations/check.png"
                className="align-bottom mr-2"
                aria-hidden
                alt=""
                width={71}
                height={71}
              />
              {benefice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
