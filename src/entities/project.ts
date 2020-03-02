export type ProjectStatus = 'eliminé' | 'lauréat'

export type Project = {
  readonly periode: string
  readonly status: ProjectStatus
  readonly nom: string
  readonly nomCandidat: string
  readonly localisation: string
  readonly puissance: number
  readonly prixUnitaire: number
}

interface MakeProjectProps {
  periode: string
  status: ProjectStatus
  nom: string
  nomCandidat: string
  localisation: string
  puissance: number
  prixUnitaire: number
}

export default function buildMakeProject() {
  return function makeProject({
    periode,
    status,
    nom,
    nomCandidat,
    localisation,
    puissance,
    prixUnitaire
  }: MakeProjectProps): Project {
    return {
      periode,
      status,
      nom,
      nomCandidat,
      localisation,
      puissance,
      prixUnitaire
    }
  }
}
