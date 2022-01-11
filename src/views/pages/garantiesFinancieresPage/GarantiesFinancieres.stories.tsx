import React from 'react'
import { GarantiesFinancieres, GarantiesFinancieresProps } from '.'
import { appelsOffreStatic } from '../../../dataAccess/inMemory'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeRequest from '../../../__tests__/fixtures/request'

export default { title: 'Garanties Financieres' }

const props: GarantiesFinancieresProps = {
  request: makeFakeRequest(),
  projects: {
    itemCount: 3,
    pagination: {
      page: 0,
      pageSize: 10,
    },
    pageCount: 1,
    items: [
      makeFakeProject({
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isInvestissementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
      }),
    ],
  },
  appelsOffre: appelsOffreStatic,
  existingAppelsOffres: [appelsOffreStatic[0].id],
}

export const GF = () => <GarantiesFinancieres {...props} />
