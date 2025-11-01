import { Input, TextArea } from 'antd'
import React from 'react'

const TextArea = ({size, placeholder, bordered, style, ...rests }) => {
  return (
    <TextArea 
        size={size} 
        placeholder={placeholder} 
        bordered={bordered} 
        style={style}
        
        {...rests} 
    />
  )
}

export default TextArea