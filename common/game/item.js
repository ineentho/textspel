import 'core-js/fn/object/entries'
import Stat from './stat.js'
import Prefix from './prefix.js'
import getItems from 'common/items/items.js'
import StatCollection from './statCollection.js'
import getPrefixes from 'common/items/prefixes.js'
import LRU from 'lru-cache'

const itemCache = LRU({
  max: 10000
})

export default class Item {
  constructor (baseItem, { prefixes = [], rarity, unseen } = {}) {
    this.prefixes = prefixes

    const prefixList = prefixes.map(prefix => prefix.name).join(' ')

    this.displayName = `${prefixList} ${baseItem.name}`

    this.baseCharacterStats = new StatCollection(Object.entries(baseItem.characterStats).map(([id, value]) => new Stat(id, value)))
    this.baseAttackStats = new StatCollection(Object.entries(baseItem.attackStats).map(([id, value]) => new Stat(id, value)))

    this.baseEmpoweredStats = baseItem.empoweredStats.map(empowerConfig => {
      const stats = new StatCollection(Object.entries(empowerConfig.stats).map(([id, value]) => new Stat(id, value)))
      return {
        stats: stats,
        category: empowerConfig.category
      }
    })

    this.characterStats = new StatCollection(this.baseCharacterStats)
    this.attackStats = new StatCollection(this.baseAttackStats)
    this.empoweredStats = []

    this.baseEmpoweredStats.forEach(({stats, category}) => {
      const obj = {stats: stats, category: category}
      this.empoweredStats.push(obj)
    })

    this.prefixes.forEach((prefix, i) => {
      if (i > 0 && prefix.path[2] === 'replicating') {
        prefix = this.prefixes[i - 1]
      }

      this.characterStats.add(prefix.characterStats)
      this.attackStats.add(prefix.attackStats)

      prefix.empoweredStats.forEach(empowered => {
        const existingEmpower = this.empoweredStats.find(emp => emp.category === empowered.category)

        if (existingEmpower) {
          if (!existingEmpower.stats) {
            // debugger
          }
          existingEmpower.stats.add(empowered.stats)
        } else {
          this.empoweredStats.push({stats: empowered.stats, category: empowered.category})
        }
      })
    })

    this.icon = baseItem.icon
    this.rarity = rarity || 'common'
    this.unseen = unseen
    this.category = this.type = baseItem.category
    this.description = baseItem.description
    this.slot = baseItem.slot
    this.id = baseItem.id
    this.canAttack = baseItem.attack
  }

  hasStat (stat) {
    return !!this.attackStats.find(stat => stat.id === stat)
  }

  get image () {
    return `/client/png/${this.icon}.png`
  }

  static async fromJSON (jsonItem) {
    const str = JSON.stringify(jsonItem)

    const cachedItem = itemCache.get(str)

    if (cachedItem) {
      return cachedItem
    }

    const { items } = await getItems()
    const { prefixes } = await getPrefixes()

    const baseItem = items.find(item => item.id === jsonItem.id)

    if (!baseItem) {
      console.warn(`Tried to create item of type ${jsonItem.id}`)
      return
    }

    const item = new Item(baseItem, {
      unseen: jsonItem.unseen,
      rarity: jsonItem.rarity,
      prefixes: (jsonItem.prefixes || []).map(prefix => {
        let prefixObj = prefixes

        for (let i = 0; i < 3; i++) {
          prefixObj = prefixObj[prefix[i]]
          if (!prefixObj) {
            console.warn('Filtering out erroneous prefix', prefix)
            return undefined
          }
        }

        return new Prefix(prefix, prefixObj)
      }).filter(prefix => prefix !== undefined)
    })

    itemCache.set(str, item)

    return item
  }

  serialize () {
    return {
      id: this.id,
      rarity: this.rarity,
      prefixes: this.prefixes.map(prefix => prefix.path),
      unseen: this.unseen
    }
  }
}
