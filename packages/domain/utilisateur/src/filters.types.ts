export const technologie = ['pv', 'eolien', 'hydraulique'] as const;
export const cycle = ['PPE2', 'CRE4'] as const;

export type Type = {
  technologie: (typeof technologie)[number][];
  cycle: (typeof cycle)[number][];
};
