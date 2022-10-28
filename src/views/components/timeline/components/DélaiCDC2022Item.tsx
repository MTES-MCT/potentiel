import { DélaiCDC2022AppliquéDTO } from '@modules/frise'
import { format } from 'date-fns'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'

export const DélaiCDC2022Item = ({
  ancienneDateLimiteAchèvement,
  nouvelleDateLimiteAchèvement,
  date,
}: DélaiCDC2022AppliquéDTO) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Application du délai de 18 mois relatif au cahier des charges modifié publié le 30/08/2022" />
        Ancienne date limite d'achèvement :{' '}
        {format(new Date(ancienneDateLimiteAchèvement), 'dd/MM/yyyy')}
        <br />
        Nouvelle date limite d'achèvement :{' '}
        {format(new Date(nouvelleDateLimiteAchèvement), 'dd/MM/yyyy')}
      </ContentArea>
    </>
  )
}
