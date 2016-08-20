import * as SMath from "common/api/specmath"

export default class Fight{
  constructor(players){
    this.playerStates = players.map(player => ({
      currentHP: player.health,
      maxHP: player.health,
      player: player
    }))

    this.turn = SMath.randomInt(this.playerStates.length)
    this.currentWeapon = 0
  }

  attack() {
    this.attacker = this.playerStates[this.turn]
    this.defender = this.playerStates[this.turn + 1] || this.playerStates[0]

    this.weapons = this.attacker.player.weaponStats

    this.numAttacks = this.weapons[this.currentWeapon].stats.getValue('attack-speed')

    // Fakking mechanics
    //
    const damage = this.weapons[this.currentWeapon].stats.getValue('damage')

    this.defender.hp -= damage

    // Fakking mechanics

    this.numAttacks -= 1

    const resp = {
      players: this.playerStates.map(pstate => ({
        currentHP: pstate.currentHP,
        maxHP: pstate.maxHP
      })),
      damage: damage
    }

    if (this.numAttacks <= 0) {
      this.currentWeapon++
      if (!this.weapons[this.currentWeapon]) {
        this.turn ++
        this.currentWeapon = 0
        if (!this.playerStates[this.turn]) {
          this.turn = 0
        }
      }
    }

    if (this.defender.hp < 0) {
      return false // Fight over
    }
    return resp
  }
}