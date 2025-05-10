import "reflect-metadata"
import { DataSource } from "../../../../src"
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
} from "../../../utils/test-utils"
import { expect } from "chai"

describe("indices > index with include columns", () => {
    let connections: DataSource[]
    before(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql"], // TODO add more compatible database types
            schemaCreate: true,
            dropSchema: true,
        })
    })
    beforeEach(() => reloadTestingDatabases(connections))
    after(() => closeTestingConnections(connections))

    it("should correctly create index with include", () =>
        Promise.all(
            connections.map(async (connection) => {
                const queryRunner = connection.createQueryRunner()
                const table = await queryRunner.getTable("post")

                expect(table!.indices.length).equal(1)
                expect(table!.indices[0].includeColumnNames).not.empty
                expect(table!.indices[0].includeColumnNames).equal([
                    "title",
                    "createdAt",
                    "updatedAt",
                ])

                await queryRunner.release()
            }),
        ))
})
