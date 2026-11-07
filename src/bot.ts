import { Bot } from "grammy"
import { saveUser } from "./db"

export function createBot(token: string, db: D1Database) {
  const bot = new Bot(token)

  // Commands
  bot.command("start", async (ctx) => {
    await saveUser(db, ctx.from!)
    await ctx.reply("started")
  })

  // Messages
  bot.on("message:text", (ctx) => ctx.reply(ctx.message.text))
  bot.on("message", (ctx) => ctx.copyMessage(ctx.chat.id))

  return bot
}
