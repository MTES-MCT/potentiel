import { DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'
import { CahierDesChargesRéférence, cahiersDesChargesRéférences, Technologie } from '@entities'
import { ContratEDF } from '@modules/edf'
import { ContratEnedis } from '@modules/enedis'
import { GarantiesFinancières } from '../../projectionsNext'

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  id: string
  appelOffreId: string
  periodeId: string
  numeroCRE: string
  familleId: string
  nomCandidat: string
  nomProjet: string
  puissanceInitiale: number
  puissance: number
  prixReference: number
  evaluationCarbone: number
  evaluationCarboneDeRéférence: number
  note: number
  nomRepresentantLegal: string
  email: string
  adresseProjet: string
  codePostalProjet: string
  communeProjet: string
  departementProjet: string
  territoireProjet?: string
  regionProjet: string
  classe: 'Classé' | 'Eliminé'
  fournisseur?: string
  actionnaire?: string
  motifsElimination?: string
  isFinancementParticipatif: boolean
  isInvestissementParticipatif: boolean
  engagementFournitureDePuissanceAlaPointe: boolean
  notifiedOn: number
  dcrDueOn: number
  completionDueOn: number
  abandonedOn: number
  details?: JSON
  certificateFileId?: string
  numeroGestionnaire?: string
  cahierDesChargesActuel: CahierDesChargesRéférence
  potentielIdentifier: string
  technologie?: Technologie
  actionnariat: 'financement-collectif' | 'gouvernance-partagee' | ''
  contratEDF?: ContratEDF
  contratEnedis?: ContratEnedis
  dateMiseEnService?: Date
  dateFileAttente?: Date
  soumisAuxGF: boolean
  garantiesFinancières?: NonAttribute<GarantiesFinancières>
}

export const MakeProjectModel = (sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      appelOffreId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      periodeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numeroCRE: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      familleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomCandidat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      puissanceInitiale: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      puissance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      prixReference: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      evaluationCarbone: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      evaluationCarboneDeRéférence: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      note: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      nomRepresentantLegal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adresseProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      codePostalProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      communeProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departementProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      territoireProjet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      regionProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fournisseur: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motifsElimination: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isFinancementParticipatif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isInvestissementParticipatif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      engagementFournitureDePuissanceAlaPointe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      notifiedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      dcrDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      completionDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      abandonedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      certificateFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      numeroGestionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cahierDesChargesActuel: {
        type: DataTypes.ENUM(...cahiersDesChargesRéférences),
        allowNull: false,
        defaultValue: 'initial',
      },
      potentielIdentifier: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'potId',
      },
      technologie: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionnariat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contratEDF: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      contratEnedis: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      dateMiseEnService: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateFileAttente: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      soumisAuxGF: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: false,
    }
  )
  return Project
}
