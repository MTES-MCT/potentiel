export type IdentifiantAppelOffre = {
  appelOffreId: string;
};
export type RawIdentifiantAppelOffre = `${string}`;

export type IdentifiantAppelOffreValueType = IdentifiantAppelOffre & {
  estÉgaleÀ(identififantAppelOffre: IdentifiantAppelOffre): boolean;
  formatter(): RawIdentifiantAppelOffre;
};

export const convertirEnIdentifiantAppelOffre = (
  identifiantAppelOffre: string | Omit<IdentifiantAppelOffreValueType, 'formatter' | 'estÉgaleÀ'>,
): IdentifiantAppelOffreValueType => {
  return {
    appelOffreId: estUnIdentifiantAppelOffre(identifiantAppelOffre)
      ? identifiantAppelOffre.appelOffreId
      : identifiantAppelOffre,
    estÉgaleÀ({ appelOffreId }: IdentifiantAppelOffre) {
      return this.appelOffreId === appelOffreId;
    },
    formatter() {
      return this.appelOffreId;
    },
  };
};

export const estUnIdentifiantAppelOffre = (value: any): value is IdentifiantAppelOffre => {
  return typeof value.appelOffreId === 'string';
};
