import db from 'server/common/database.js'
import NPC from 'common/game/npc.js'
import stats from 'common/json/stats.json'
import Stat from 'common/game/stat.js'
import Item from 'common/game/item.js'
import StatCollection from 'common/game/statCollection.js'
import EquippedInventory from 'common/game/equippedInventory.js'

const playerDB = db.get('users')

const npcs = []

export async function parseNPCs () {
  const npcConfig = await System.import('common/json/enemies.json')
  const enemies = await Promise.all(npcConfig.enemies.map(url => System.import(url)))

  enemies.forEach(enemy => {
    npcs.push(enemy)
  })
}

export function getCurrentNPCsForPlayer (acc) {
  let updateDB = false
  let diffVal = 0.1
  if (acc.npcDifficulty) {
    diffVal = acc.npcDifficulty
  } else {
    acc.npcDifficulty = diffVal
    updateDB = true
  }
  let npcsForPlayer = []
  if (acc.npcs && acc.npcs.length > 0) {
    npcsForPlayer = acc.npcs
  } else {
    npcsForPlayer = acc.npcs = genNewNPCs(diffVal)
    updateDB = true
  }
  if (updateDB) {
    update(acc)
  }
  return npcsForPlayer
}

export function genNewNPCs (diffVal) {
  let npcsForPlayer = []
  for (let i = 0; i < 5; i++) {
    npcsForPlayer[i] = randomizeNPC(diffVal, i).serialize()
  }
  return npcsForPlayer
}

function randomizeNPC (diffVal, selectDiff) {
  const npcIndex = Math.floor(Math.random() * npcs.length)
  const npc = npcs[npcIndex] ? npcs[npcIndex] : npcs[0]
  const difficulty = diffVal * (selectDiff + 1)

  const weapons = {
    head: EquippedInventory.SLOT_HEAD,
    body: EquippedInventory.SLOT_BODY,
    legs: EquippedInventory.SLOT_LEGS,
    feet: EquippedInventory.SLOT_FEET,
    left: EquippedInventory.SLOT_LEFT_HAND,
    right: EquippedInventory.SLOT_RIGHT_HAND,
    trinket: EquippedInventory.SLOT_TRINKET
  }

  const equipped = new EquippedInventory({}, 7)

  const weaponStats = Object.entries(weapons).map(([key, slot]) => {
    const weaponConfig = npc.equipped[key]
    if (!weaponConfig) {
      return
    }

    const weapon = Item.fromJSON({
      id: weaponConfig.id,
      rarity: 'legendary',
      prefixes: []
    })

    equipped.set(slot, weapon)

    return {
      weapon: weapon,
      stats: buildStatCollection(weaponConfig.stats, difficulty)
    }
  }).filter(weapon => weapon)

  return new NPC({
    name: npc.name,
    difficulty: selectDiff,
    stats: buildStatCollection(npc.stats, difficulty),
    weaponStats: weaponStats,
    equipped: equipped,
    type: 'npc'
  })
}

function buildStatCollection (stats, diffVal) {
  const statCollection = new StatCollection()
  Object.entries(stats).forEach(([key, value]) => {
    const val = randomizeValue(key, value, diffVal)
    const stat = new Stat(key, val)
    statCollection.add(stat)
  })
  return statCollection
}

function randomizeValue (key, valArr, diffVal) {
  let result = valArr[0] + Math.random() * (valArr[1] - valArr[0])
  result *= getMultiplierValue()
  result *= diffVal
  return shouldRound(key) ? Math.round(result) : result
}

function shouldRound (key) {
  return stats[key].rounded
}

function getMultiplierValue () {
  return Math.random() * 0.4 + 0.8
}

function update (acc) {
  playerDB.update({_id: acc._id}, acc).then(
    () => console.log('Player "' + acc.username + '"s npcs updated.')
  ).catch(err => console.error(err.stack || err))
}
