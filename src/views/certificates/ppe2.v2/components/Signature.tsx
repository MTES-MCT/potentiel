import { Text, View } from '@react-pdf/renderer'
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
    wrap={false}
  >
    <Text style={{ fontWeight: 'bold' }}>
      Le sous-directeur du système électrique et des énergies renouvelables
    </Text>
    <Text style={{ marginTop: 30 }}>Nicolas CLAUSSET</Text>
  </View>
)
