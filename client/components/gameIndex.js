import React from 'react'
import 'client/css/account.scss'
import InventorySlot from './inventorySlot.js'
import Player from 'common/game/player.js'
import InvItem from './invItem.js'
import request from 'common/api/request.js'
import CharacterStats from './characterStats.js'

const INV_WIDTH = 12
const INV_HEIGHT = 10
const INV_MARGIN = 5
const INV_SLOT_SIZE = 50

export default class GameIndex extends React.Component {

  constructor () {
    super()

    this.state = {
      player: {

      }
    }

    this.getItem = this.getItem.bind(this)
    this.requestItem = this.requestItem.bind(this)
    this.createSpecialSlot = this.createSpecialSlot.bind(this)
    this.reassemble = this.reassemble.bind(this)

    this.updatePlayer()
  }

  async request (url) {
    const resp = (await request.post(url)).json
    this.updatePlayer(resp)
  }

  async reassemble () {
    await this.request('/api/game/reassemble')
  }

  getItem (inventory, index) {
    const item = this.state.player[inventory] && this.state.player[inventory].get(index)
    if (!item) {
      return
    }
    return <InvItem item={item} switchItems={this.switchItems.bind(this)} inventory={inventory} slot={index} />
  }

  createSlot (x, y, index) {
    const style = {
      top: INV_MARGIN + y * (INV_MARGIN + INV_SLOT_SIZE),
      left: INV_MARGIN + x * (INV_MARGIN + INV_SLOT_SIZE),
      position: 'absolute'
    }
    return <InventorySlot accepts='any' style={style} key={index} switchItems={this.switchItems.bind(this)} inventory='inventory' slot={index}> {this.getItem('inventory', index)} </InventorySlot>
  }

  async switchItems (data) {
    const jsonPlayer = (await request.post('/api/game/swapItems', data)).json
    this.updatePlayer(jsonPlayer)
  }

  getInventory () {
    let slots = []
    let index = 0
    for (let y = 0; y < INV_HEIGHT; y++) {
      for (let x = 0; x < INV_WIDTH; x++) {
        slots.push(this.createSlot(x, y, index))
        index++
      }
    }

    return slots
  }

  async updatePlayer (jsonPlayer) {
    if (!jsonPlayer) {
      jsonPlayer = (await request.get('/api/user/get')).json
    }
    const player = await Player.fromJSON(jsonPlayer)
    this.setState({player})
  }

  async requestItem () {
    const resp = (await request.post('/api/game/requestItem')).json
    this.updatePlayer(resp)
  }

  createSpecialSlot (inventory, slot, special = '', accepts = 'any') {
    return <InventorySlot accepts={accepts} special={special} switchItems={this.switchItems.bind(this)} inventory={inventory} slot={slot}> {this.getItem(inventory, slot)} </InventorySlot>
  }

  render () {
    return (
      <div className='container'>
        <div className='window equip-window'>
          <h2>Equipped Items</h2>
          <div className='equip'>
            {this.createSpecialSlot('equipped', 0, 'head', 'head')}
            {this.createSpecialSlot('equipped', 1, 'body', 'torso')}
            {this.createSpecialSlot('equipped', 2, 'legs', 'legs')}
            {this.createSpecialSlot('equipped', 3, 'boots', 'feet')}
            {this.createSpecialSlot('equipped', 4, 'lefthand', 'hand')}
            {this.createSpecialSlot('equipped', 5, 'righthand', 'hand')}
          </div>
        </div>

        <div className='window inventory-window'>
          <h2>Inventory</h2>
          <div className='inventory'>
            {this.getInventory()}
          </div>
          <div className='bottom-inventory'>
            <div className='recraft-inventory'>
              {this.createSpecialSlot('reassemble', 0, 'craft-1', 'any')}
              {this.createSpecialSlot('reassemble', 1, 'craft-2', 'any')}
              {this.createSpecialSlot('reassemble', 2, 'craft-3', 'any')}
              {this.createSpecialSlot('reassemble', 3, 'craft-4', 'any')}
              <button onClick={this.reassemble} className='craft-button'>Reassemble</button>
            </div>
          </div>
        </div>

        <br />
        <button id='spawnItem' onClick={this.requestItem}>Spawn Item</button>

        <br />

        <div className='window tooltip-window'>
          <div id='characterstats' className='tooltip tooltip-stat'>
            <CharacterStats player={this.state.player} />
          </div>
        </div>
      </div>
    )
  }
}
