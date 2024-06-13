import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreManager {
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
}