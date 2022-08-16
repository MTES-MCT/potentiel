import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import { Signataire } from '../..'

export const Signature = ({ signataire }: { signataire: Signataire }) => (
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
    <Text style={{ fontWeight: 'bold' }}>{signataire.fonction}</Text>
    <Text style={{ marginTop: 30 }}>{signataire.fullName}</Text>
  </View>
)
