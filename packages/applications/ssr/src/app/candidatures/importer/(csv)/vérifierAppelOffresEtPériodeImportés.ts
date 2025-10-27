import * as zod from 'zod';

type VérifierAppelOffresEtPériodesImportésProps = {
  line: {
    appelOffre: string;
    période: string;
  };
  cible: {
    appelOffre: string;
    periode: string;
  };
};

export const vérifierAppelOffresEtPériodeImportés = ({
  line,
  cible,
}: VérifierAppelOffresEtPériodesImportésProps) => {
  if (line.appelOffre !== cible.appelOffre) {
    throw new zod.ZodError([
      {
        path: ['appelOffre'],
        code: 'custom',
        message: `L'appel d'offres importé (${line.appelOffre}) ne correspond pas à l'appel d'offres cible (${cible.appelOffre})`,
      },
    ]);
  }

  if (line.période !== cible.periode) {
    throw new zod.ZodError([
      {
        path: ['periode'],
        code: 'custom',
        message: `La période importée (${line.période}) ne correspond pas à la période cible (${cible.periode})`,
      },
    ]);
  }
};
