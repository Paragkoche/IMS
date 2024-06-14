import { Column, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreManager } from "./StoreManager.model";
import { Items } from "./Item";

@Entity()
export class Store {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    isOpen: boolean

    @Column()
    since: Date

    @OneToOne(() => StoreManager, (StoreManage) => StoreManage.Store)
    StoreManager: StoreManager;


    @OneToMany(() => Items, (items) => items.store)
    @JoinTable()
    itemsAvailableInStore: Items[]
}