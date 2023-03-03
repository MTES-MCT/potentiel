import { Project } from '@entities';
import { getDateFinGarantieFinanciere } from './getDateFinGarantieFinanciere';

describe(`Méthode getDateFinGarantieFinanciere`, () => {
  const notifiedOn = new Date('2023-01-01').getTime();

  it(`Lorsque j'appelle la fonction avec une famille soumise aux garanties financières après candidature
    Alors la fonction doit me retourner une date au format dd/MM/yyyy égale à la date de notification + le nombre de mois renseigné dans la famille`, () => {
    const résultatAttendu = '01/01/2024';

    expect(
      getDateFinGarantieFinanciere({
        famille: {
          id: 'identifiantFamille',
          title: 'famille',
          soumisAuxGarantiesFinancieres: 'après candidature',
          garantieFinanciereEnMois: 12,
        },
        appelOffre: undefined,
        notifiedOn,
      }),
    ).toEqual(résultatAttendu);
  });

  it(`Lorsque j'appelle la fonction sans famille mais avec un appel d'offre soumis aux garanties financières après candidature
    Alors la fonction doit me retourner une date au format dd/MM/yyyy égale à la date de notification + le nombre de mois renseigné dans l'appel d'offre`, () => {
    const résultatAttendu = '01/01/2024';

    expect(
      getDateFinGarantieFinanciere({
        famille: undefined,
        appelOffre: {
          soumisAuxGarantiesFinancieres: 'après candidature',
          garantieFinanciereEnMois: 12,
        } as Project['appelOffre'],
        notifiedOn,
      }),
    ).toEqual(résultatAttendu);
  });

  it(`Lorsque j'appelle la fonction sans famille ni appel d'offre
  Alors la fonction doit me retourner une chaine de caractère !!!FAMILLE NON DISPONIBLE!!!`, () => {
    expect(
      getDateFinGarantieFinanciere({
        famille: undefined,
        appelOffre: undefined,
        notifiedOn,
      }),
    ).toEqual('!!!FAMILLE NON DISPONIBLE!!!');
  });
});
