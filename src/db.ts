export interface User {
  id: number
  username?: string
  first_name?: string
}

export function saveUser(db: D1Database, user: User) {
  return db
    .prepare(
      `INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET username = excluded.username, first_name = excluded.first_name`,
    )
    .bind(user.id, user.username ?? null, user.first_name ?? null)
    .run()
}
