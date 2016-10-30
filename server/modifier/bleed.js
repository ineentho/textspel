export default {
  apply (fightData) {
    const defender = fightData.defenderIndex
    const weapon = fightData.weapons[fightData.currentWeapon]

    if (Math.random() < weapon.stats.getValue('bleed-chance')) {
      let bleedStack = {
        type: 'bleed',
        duration: weapon.stats.getValue('bleed-duration')
      }
      fightData.playerStates[defender].buffs.push(bleedStack)
    }
    return fightData
  },

  tick (fightData) {
    let damage = 0
    const ps = fightData.playerStates[fightData.defenderIndex]
    ps.buffs = ps.buffs.filter(buff => !(buff.type === 'bleed' && buff.duration <= 0))
    ps.buffs.filter(buff => buff.type === 'bleed').forEach(buff => {
      damage++
      buff.duration--
    })
    if (damage > 0) {
      fightData.dots.bleed = {
        type: 'bleed',
        damage: damage
      }
    }
    return fightData
  }
}
