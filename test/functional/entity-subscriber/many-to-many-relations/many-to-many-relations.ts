import { DataSource } from "../../../../src"
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
} from "../../../utils/test-utils"
import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import { MockSubscriber } from "./subscribers/MockSubscriber"
import { expect } from "chai"

describe("entity subscriber > many-to-many-relations", () => {
    let connections: DataSource[]

    before(
        async () =>
            (connections = await createTestingConnections({
                entities: [Post, Category],
                subscribers: [MockSubscriber],
                dropSchema: true,
                schemaCreate: true,
                enabledDrivers: ["sqlite", "mssql", "mysql"],
            })),
    )
    beforeEach(() => reloadTestingDatabases(connections))
    after(async () => {
        try {
            await closeTestingConnections(connections)
        } catch (err) {
            console.warn(err.stack)
            // throw err
        }
    })

    function filterSubscriberData(
        manyToManyData: Record<string, any>[],
        action: string,
    ) {
        return manyToManyData.filter((data) => data.action === action)
    }

    function testSubscriberResult(
        manyToManyData: Record<string, any>[],
        action: string,
        expectedCallCount: number,
    ) {
        expect(
            filterSubscriberData(manyToManyData, action).length,
            `Check "${action}" is called ${expectedCallCount} times for many-to-many relation table`,
        ).to.be.eql(expectedCallCount)

        expect(
            !filterSubscriberData(manyToManyData, action).some(
                (data) => data === undefined,
            ),
            `Check entity in "${action}" event isn't undefined`,
        ).to.be.eql(true)

        expect(
            !filterSubscriberData(manyToManyData, action).some((data) =>
                Object.values(data.entity).some((value) => value === undefined),
            ),
            `Check entity in "${action}" event hasn't undefined values`,
        ).to.be.eql(true)
    }

    it("subscriber for many to many relations has all needed information", () =>
        Promise.all(
            connections.map(async (connection) => {
                const categoryRepository = connection.getRepository(Category)

                let cat1 = new Category()
                cat1.name = "Category 1"

                let cat2 = new Category()
                cat2.name = "Category 2"

                cat1 = await categoryRepository.save(cat1)
                cat2 = await categoryRepository.save(cat2)

                const subscriber = connection.subscribers[0] as MockSubscriber
                subscriber.clear()

                const postRepository = connection.getRepository(Post)

                let post = new Post()
                post.title = "Foo"
                post.categories = [cat1]

                post = await postRepository.save(post)

                post.categories.push(cat2)

                post = await postRepository.save(post)

                post.categories = [cat2]

                await postRepository.save(post)

                const manyToManyData = subscriber.calledData.filter(
                    (data) => data.tableName === "post_categories_category",
                )
                expect(manyToManyData.length).to.be.eql(6)

                testSubscriberResult(manyToManyData, "beforeInsert", 2)
                testSubscriberResult(manyToManyData, "afterInsert", 2)
                testSubscriberResult(manyToManyData, "beforeRemove", 2)
                testSubscriberResult(manyToManyData, "afterRemove", 2)
            }),
        ))
})
