import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./Item";

@Entity()
export class StoreOrders {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    status: string

    @Column()
    payment_status: string

    @Column()
    atNow: string;

    @OneToMany(() => Items, (item) => item.storeOrders)
    @JoinTable()
    items: Items[]


}