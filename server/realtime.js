import url from 'url'
import ServerPlayer from 'common/game/serverPlayer.js'
import RealtimePlayer from './realtime/realtimePlayer.js'
import { fightManager } from './fightManager.js'

export const players = []

function sendPlayerCount () {
  const count = players.length

  for (const player of players) {
    player.updatePlayerCount(count)
  }
}

export function acceptInvite (playerId, inviteId) {
  let inviteAccepted = false
  const playerRps = players.filter(realtimePlayer => realtimePlayer.player.id.equals(playerId))
  const otherRps = players.filter(rp => rp.player.id.equals(inviteId))

  if (!(playerRps.length > 0 && otherRps.length > 0)) {
    return
  }

  playerRps.forEach(invitedRealtimePlayer => {
    if (invitedRealtimePlayer.acceptInvite(inviteId)) {
      inviteAccepted = true
    }
  })

  if (inviteAccepted) {
    otherRps.forEach(other => {
      sendMessage(other.player.id, 'startgame')
    })
    const p1 = playerRps[0].player
    const p2 = otherRps[0].player
    const fight = fightManager.startFight([p1, p2])
    fight.on('attack', attack => {
      sendMessage(p1.id, 'fight.attack', attack)
      sendMessage(p2.id, 'fight.attack', attack)
    })
  }
}

export function invitePlayer (playerId, sourcePlayer) {
  players.filter(realtimePlayer => {
    return realtimePlayer.player.id.equals(playerId)
  }).forEach(realtimePlayer => {
    realtimePlayer.addInvite(sourcePlayer)
  })
}

export function sendMessage (playerId, messageId, data) {
  players.filter(realtimePlayer => {
    return realtimePlayer.player.id.equals(playerId)
  }).forEach(realtimePlayer => {
    realtimePlayer.send(messageId, data)
  })
}

export default function realtime (wss) {
  wss.on('connection', checkError(async ws => {
    const location = url.parse(ws.upgradeReq.url, true)
    const player = await ServerPlayer.fromKey(location.query.token)

    if (player) {
      const realtimePlayer = new RealtimePlayer(player, ws)
      realtimePlayer.send('status.auth', true)
      players.push(realtimePlayer)
      sendPlayerCount()

      ws.addEventListener('close', () => {
        players.splice(players.indexOf(realtimePlayer), 1)
        sendPlayerCount()
      })
    } else {
      ws.terminate()
    }
  }))
}

function checkError (cb) {
  return (...args) => {
    return Promise.resolve(cb(...args)).catch(err => console.error(err))
  }
}
