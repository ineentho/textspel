import ItemGen from 'common/game/itemGenerator.js'

export async function requestItem(ctx){
  ctx.player.inventory.push(ItemGen.genitem())
}

export async function requestInventory(ctx){
  ctx.body = ctx.player.inventory.serialize()
}
