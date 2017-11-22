import React from 'react'
import styled from 'styled-components'

const InventorySlot = styled.div`
  width: 50px;
  height: 50px;
  margin: 5px;
  background: orange;

  ${props =>
    props.cluster &&
    `
    width: 950px;
    height: 250px;
    margin: 10px 0;
    background: orange;
`};

  ${props =>
    props.stats &&
    `
    padding: 20px;
    width: 200px;
    height: 250px;
    margin: 10px;
    background: orange;
    font-size: 16px;
`};
`

export default InventorySlot
