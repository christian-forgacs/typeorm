import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
} from "../../../../../src"

@EventSubscriber()
export class MockSubscriber implements EntitySubscriberInterface {
    calledData: any[] = []

    beforeInsert(event: InsertEvent<any>): void {
        if (event.metadata.tableName === "post_categories_category") {
            console.log({
                action: "beforeInsert",
                tableName: event.metadata.tableName,
                entity: event.entity,
            })
        }
        this.calledData.push({
            action: "beforeInsert",
            tableName: event.metadata.tableName,
            entity: event.entity,
        })
    }

    afterInsert(event: InsertEvent<any>): void {
        if (event.metadata.tableName === "post_categories_category") {
            console.log({
                action: "afterInsert",
                tableName: event.metadata.tableName,
                entity: event.entity,
            })
        }
        this.calledData.push({
            action: "afterInsert",
            tableName: event.metadata.tableName,
            entity: event.entity,
        })
    }

    beforeRemove(event: RemoveEvent<any>): void {
        if (event.metadata.tableName === "post_categories_category") {
            console.log({
                action: "beforeRemove",
                tableName: event.metadata.tableName,
                entity: event.entityId,
            })
        }
        this.calledData.push({
            action: "beforeRemove",
            tableName: event.metadata.tableName,
            entity: event.entityId,
        })
    }

    afterRemove(event: RemoveEvent<any>): void {
        if (event.metadata.tableName === "post_categories_category") {
            console.log({
                action: "afterRemove",
                tableName: event.metadata.tableName,
                entity: event.entityId,
            })
        }
        this.calledData.push({
            action: "afterRemove",
            tableName: event.metadata.tableName,
            entity: event.entityId,
        })
    }

    clear() {
        this.calledData = []
    }
}
