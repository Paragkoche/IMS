import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./Store.model";
import { User } from "./user.model";

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

    @OneToOne(() => Store, (store) => store.StoreManager)
    @JoinColumn()
    Store: Store;

    @OneToOne(() => User, (user) => user.storeManage)
    user: User
}