import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { ModificationReceivedItemProps } from '../helpers'
export const ModificationReceivedItem = (props: ModificationReceivedItemProps) => {
  const { date } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...props} />
      </ContentArea>
    </>
  )
}

const Title = (props: ModificationReceivedItemProps) => {
  const { modificationType } = props
  const libelleTypeDemande: { [key in ModificationReceivedItemProps['modificationType']]: string } =
    {
      producteur: 'de producteur',
      actionnaire: "d'actionnaire",
      fournisseurs: 'de fournisseurs',
      puissance: 'de puissance',
    }

  return (
    <>
      <ItemTitle
        title={`Information concernant un changement ${libelleTypeDemande[modificationType]}`}
      />
      {modificationType === 'producteur' && (
        <p className="p-0 m-0">Producteur : {props.producteur}</p>
      )}
      {modificationType === 'actionnaire' && (
        <p className="p-0 m-0">Actionnaire : {props.actionnaire}</p>
      )}
      {modificationType === 'puissance' && (
        <p className="p-0 m-0">
          Puissance : {props.puissance} {props.unitePuissance}
        </p>
      )}
      {modificationType === 'fournisseurs' &&
        props.fournisseurs.map((fournisseur, index) => (
          <li key={index}>
            {fournisseur.kind} : {fournisseur.name}
          </li>
        ))}
    </>
  )
}
