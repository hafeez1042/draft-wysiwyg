import * as React from 'react'
import styled from 'react-emotion'

type ButtonProps = {
  reversed?: boolean,
  active?: boolean,
}

export const Button = styled('span')`
  cursor: pointer;
  color: ${(props: ButtonProps) =>
    props.reversed
      ? props.active ? 'white' : '#aaa'
      : props.active ? 'black' : '#ccc'};
`