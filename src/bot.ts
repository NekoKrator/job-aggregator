import { Bot } from "grammy"

export function createBot(token: string) {
  const bot = new Bot(token)

  // Commands
  bot.command("start", (ctx) => ctx.reply("started"))

  // Messages
  bot.on("message:text", (ctx) => ctx.reply(ctx.message.text))
  bot.on("message", (ctx) => ctx.copyMessage(ctx.chat.id))

  return bot
}