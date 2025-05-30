import { Entity } from "../../../../src/decorator/entity/Entity"
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn"
import { Column } from "../../../../src/decorator/columns/Column"
import { ManyToOne } from "../../../../src/decorator/relations/ManyToOne"
import { Post } from "./Post"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Post, (post) => post.secondaryCategories)
    post: Post
}
