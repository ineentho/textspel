import React from 'react'
import { DropTarget } from 'react-dnd'

class InventorySlot extends React.Component {

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let specialClass = ''
    if (this.props.special) {
      specialClass = ` inv-${this.props.special}`
    }
  
    const { connectDropTarget, isOver } = this.props

    const possible = [
      'itemmove',
      'itemmove2',
      'itemmove3',
      'itemmove4',
      'itemmove5',
      'itemmove6'
    ]

    const image = possible[parseInt(this.props.slot) % 6]

    return connectDropTarget(
      <div className={`inv-slot${specialClass}`}  style={this.props.style} data-slot={this.props.slot}>
        { isOver && <img className="itemmove" src={`/client/png/${image}.png`} /> }
        {this.props.children}
      </div>
    )
  }
}

const target = {
  drop(droppedItem, targetMonitor, targetSlot) {
    const res =  {
      inventory: droppedItem.inventory,
      item: parseInt(droppedItem.slot)
    }
    console.log(res)
    return res
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  didDrop: monitor.didDrop(),
  isOverCurrent: monitor.isOver({ shallow: true }),
})

export default DropTarget('item', target, collect)(InventorySlot)
