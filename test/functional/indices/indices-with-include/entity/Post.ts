import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    Index,
    UpdateDateColumn,
} from "../../../../../src"

@Entity()
export class Post extends BaseEntity {
    @PrimaryColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({
        nullable: true,
    })
    @Index({
        includeColumnNames: ["title", "createdAt", "updatedAt"],
    })
    externalId?: string

    @Column()
    title: string

    @Column({
        default: "This is default text.",
    })
    text: string
}
