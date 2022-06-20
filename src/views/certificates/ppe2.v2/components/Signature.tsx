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
    wrap={false}
  >
    <Text style={{ fontWeight: 'bold' }}>La ministre de la Transition énergétique</Text>
    {/* <Image
      style={{
        width: 130,
        height: 105,
        marginHorizontal: 'auto',
      }}
      src={process.env.BASE_URL + '/images/signature.png'}
    /> */}
    <Text style={{ marginTop: 30 }}>Agnès Pannier-Runacher</Text>
  </View>
)
