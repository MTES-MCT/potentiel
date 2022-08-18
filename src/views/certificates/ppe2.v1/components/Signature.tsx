import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { Validateur } from '../..'

type SignatureProps = {
  validateur: Validateur
}

export const Signature = ({ validateur }: SignatureProps) => (
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
    <Text style={{ fontSize: 10, marginTop: 30, textAlign: 'center' }}>{validateur.fullName}</Text>
    <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>
      {validateur.fonction}
    </Text>
  </View>
)
