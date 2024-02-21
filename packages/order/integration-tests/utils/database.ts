import { TestDatabaseUtils } from "medusa-test-utils"

import * as Models from "@models"

const mikroOrmEntities = Models as unknown as any[]

export const MikroOrmWrapper = TestDatabaseUtils.getMikroOrmWrapper({
  mikroOrmEntities,
  schema: process.env.MEDUSA_ORDER_DB_SCHEMA,
})

export const DB_URL = TestDatabaseUtils.getDatabaseURL()
