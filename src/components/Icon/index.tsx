import * as React from 'react'
import styled from 'react-emotion'

type IconProps = {
  className?: string,
  children?: string,
}

export const Icon = styled(({ className, ...rest }: IconProps) => {
  return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 18px;
  vertical-align: text-bottom;
`