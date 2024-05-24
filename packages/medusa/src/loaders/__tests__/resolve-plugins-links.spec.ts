import { mkdirSync, rmSync, writeFileSync } from "fs"
import { resolve } from "path"
import { resolvePluginsLinks } from "../helpers/resolve-plugins-links"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"

const distTestTargetDirectorPath = resolve(__dirname, "__links__")

const getFolderTestTargetDirectoryPath = (folderName: string): string => {
  return resolve(distTestTargetDirectorPath, folderName)
}

describe("resolve plugins links", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })

    mkdirSync(getFolderTestTargetDirectoryPath("links"), {
      mode: "777",
      recursive: true,
    })
  })

  afterAll(() => {
    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })
  })

  it("should load the custom links from the links directory", async () => {
    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("links"), "link.js"),
      `
        export default {
          isLink: true
        }
      `
    )

    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("links"), "empty-link.js"),
      `
          export default 'string'
      `
    )

    const loggerMock = { warn: jest.fn() }
    const container = createMedusaContainer()
    container.register({
      logger: asValue(loggerMock),
    })

    const links = await resolvePluginsLinks(
      [
        {
          resolve: distTestTargetDirectorPath,
        },
      ],
      container
    )

    expect(loggerMock.warn).toHaveBeenCalledTimes(1)
    expect(loggerMock.warn).toHaveBeenCalledWith(
      `Links file ${distTestTargetDirectorPath}/links/empty-link.js does not export a default object`
    )

    expect(links).toEqual([
      {
        isLink: true,
      },
    ])
  })
})
