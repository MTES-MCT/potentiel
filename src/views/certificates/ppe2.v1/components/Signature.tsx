import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'

type SignatureProps = {
  validateur: {
    nom: string
    prénom: string
    fonction: string
  }
  signatureUrl?: string
}

export const Signature = ({
  validateur: { nom, prénom, fonction },
  signatureUrl = undefined,
}: SignatureProps) => (
  <View
    style={{
      width: 200,
      marginTop: 30,
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 'auto',
      textAlign: 'center',
    }}
    wrap={false}
  >
    <Text style={{ fontWeight: 'bold' }}>{fonction}</Text>
    {/* <Image
      style={{
        width: 130,
        height: 105,
        marginHorizontal: 'auto',
      }}
      src={process.env.BASE_URL + '/images/signature.png'}
    /> */}
    <Text style={{ marginTop: -30 }}>
      {prénom} {nom.toUpperCase()}
    </Text>
  </View>
)
