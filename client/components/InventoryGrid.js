import React from 'react'
import PropTypes from 'prop-types'
import InventorySlot from './InventorySlot.js'
import _ from 'lodash'
import { Container } from './Container.js'
import styled from 'styled-components'

const ContainerGrid = styled(Container)`
  display: grid;
  grid-template-columns: repeat(${props => props.slotsWide}, 50px);
  grid-column-gap: ${props => props.margin}px;
  grid-row-gap: ${props => props.margin}px;
`

const InventoryGrid = ({ width, height, margin = 10 }) => (
  <ContainerGrid margin={margin} slotsWide={width}>
    {_.range(width * height).map(i => <InventorySlot key={i} />)}
  </ContainerGrid>
)

InventoryGrid.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.number,
}

export default InventoryGrid
