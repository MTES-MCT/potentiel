import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Signature = () => (
  <View
    style={{
      width: 200,
      marginTop: 30,
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 'auto',
      textAlign: 'center',
    }}
  >
    <Text style={{ fontWeight: 'bold' }}>
      L’adjoint au sous-directeur du système électrique et des énergies renouvelables
    </Text>
    <Image
      style={{
        width: 130,
        height: 105,
        marginHorizontal: 'auto',
      }}
      src={process.env.BASE_URL + '/images/signature.png'}
    />
    <Text style={{ marginTop: -30 }}>Ghislain FERRAN</Text>
  </View>
)
