const { createCanvas, loadImage, Image } = require('canvas')
const path = require('path')
const inventorySlots = require('./inventorySlots')

for (let i = 36 + 1; i <= 44; i++) {
  inventorySlots[i] = [inventorySlots[i - 1][0] + 36, inventorySlots[i - 1][1]]
}

// Add armor slots (5 - 8)
for (let i = 5 + 1; i <= 8; i++) {
  inventorySlots[i] = [inventorySlots[i - 1][0], inventorySlots[i - 1][1] + 36]
}

// Add inventory slots (9 - 35)
for (let i = 9 + 1; i <= 17; i++) {
  inventorySlots[i] = [inventorySlots[i - 1][0] + 36, inventorySlots[i - 1][1]]
}
for (let i = 18 + 1; i <= 26; i++) {
  inventorySlots[i] = [inventorySlots[i - 1][0] + 36, inventorySlots[i - 1][1]]
}
for (let i = 27 + 1; i <= 35; i++) {
  inventorySlots[i] = [inventorySlots[i - 1][0] + 36, inventorySlots[i - 1][1]]
}

async function makeImage (inventory) {
  const canvas = createCanvas(352, 332)
  const ctx = canvas.getContext('2d')
  const image = await loadImage(path.join(__dirname, 'PackInventoryWindow.png'))
  ctx.drawImage(image, 0, 0, 352, 332)
  for (const item in inventory) {
    if (inventory[item]?.slot) {
      const inventorySlot = inventorySlots[inventory[item].slot]

      if (inventory[item].texture && inventorySlot) {
        const itemImage = new Image()
        itemImage.onload = () => {
        // Draw item image
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(itemImage, inventorySlot[0], inventorySlot[1], 32, 32)

          // Draw item count
          if (inventory[item].count > 1) {
            ctx.font = 'bold 20px monospace'
            ctx.fillStyle = 'black'
            ctx.textAlign = 'end'
            ctx.fillText(inventory[item].count, inventorySlot[0] + 33, inventorySlot[1] + 31)
            ctx.fillStyle = 'white'
            ctx.fillText(inventory[item].count, inventorySlot[0] + 32, inventorySlot[1] + 30)
          }
        }
        itemImage.src = inventory[item].texture
      } else {
        console.log()
      }
    }
  }
  return canvas
}

async function handleInventory (bot) {
  const mcAssets = require('minecraft-assets')(bot.version)
  const inventory = bot.inventory.slots
  inventory.forEach((_, ix, arr) => {
    if (arr[ix]) {
      inventory[ix].texture = mcAssets.textureContent[arr[ix].name].texture
    }
  })
  return makeImage(inventory)
}

module.exports = handleInventory
