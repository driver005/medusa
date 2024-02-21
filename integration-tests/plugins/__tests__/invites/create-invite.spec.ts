import { initDb, useDb } from "../../../environment-helpers/use-db"

import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../environment-helpers/use-api"
import adminSeeder from "../../../helpers/admin-seeder"
import { AxiosInstance } from "axios"
import { createAdminUser } from "../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("POST /admin/invites", () => {
  let dbConnection
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
  })

  beforeEach(async () => {
    await createAdminUser(dbConnection, adminHeaders)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("create an invite", async () => {
    const api = useApi()! as AxiosInstance

    const body = {
      email: "test_member@test.com",
    }

    const response = await api.post(`/admin/invites`, body, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      invite: expect.objectContaining(body),
    })
  })
})
