import { Text, View } from '@react-pdf/renderer'
import React from 'react'

export const PageFooter = () => (
  <View style={{ fontSize: 7, position: 'absolute', bottom: 40, left: 55 }} fixed>
    <Text style={{ marginBottom: 10 }}>ecologique.gouv.fr</Text>
    <Text>92055 La Défense cedex – Tél. : 33(0)1 40 81 21 22</Text>
  </View>
)
