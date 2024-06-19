import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Doc } from "./emplyeeDoc";

@Entity()
export class Manager {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    joinAt: Date

    @Column()
    salary: string

    @Column()
    age: number

    @Column()
    address: string

    @Column()
    bond: Date

    @OneToOne(() => User, (user) => user.manager)
    user: User;

    @OneToMany(() => Doc, (doc) => doc.manager)
    @JoinColumn()
    doc: Doc[]
}