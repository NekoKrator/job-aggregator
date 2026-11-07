import { Api, webhookCallback } from "grammy"
import { createBot } from "./bot"

interface Env {
  BOT_TOKEN: string
  WEBHOOK_SECRET: string
  DB: D1Database
}

async function setup(url: URL, env: Env): Promise<Response> {
  if (url.searchParams.get("secret") !== env.WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 })
  }

  const webhookUrl = `${url.origin}/webhook`
  await new Api(env.BOT_TOKEN).setWebhook(webhookUrl, { secret_token: env.WEBHOOK_SECRET })

  return new Response(`webhook set to ${webhookUrl}`)
}

function webhook(request: Request, env: Env): Promise<Response> {
  const handle = webhookCallback(createBot(env.BOT_TOKEN),"cloudflare-mod", {
    secretToken: env.WEBHOOK_SECRET,
  })

  return handle(request)
}

export default {
  fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === "/setup") return setup(url, env)
    if (url.pathname === "/webhook" && request.method === "POST") return webhook(request, env)

    return new Response("ok")
  },
} satisfies ExportedHandler<Env>
