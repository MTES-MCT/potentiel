import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import { Signataire } from '../..'

type SignatureProps = {
  signataire: Signataire
}

export const Signature = ({ signataire }: SignatureProps) => (
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
    <Text style={{ fontSize: 10, marginTop: 30, textAlign: 'center' }}>{signataire.fullName}</Text>
    <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>
      {signataire.fonction}
    </Text>
  </View>
)
