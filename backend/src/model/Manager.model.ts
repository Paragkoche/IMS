import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

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
    user: User
}