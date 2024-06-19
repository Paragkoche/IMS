import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Doc } from "./emplyeeDoc";
import { Orders } from "./Order.model";
import { StoreOrders } from "./StoreOrder";

@Entity()
export class deliveryPartner {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    joinAt: Date;

    @Column()
    salary: string;

    @Column()
    age: number;

    @Column()
    address: string;

    @Column()
    bond: Date

    @Column()
    liveLocation: string;

    @OneToMany(() => Doc, (doc) => doc.deliveryP)
    doc: Doc[]

    @OneToMany(() => Orders, (ord) => ord.dp)
    ord: Orders[]

    @OneToMany(() => StoreOrders, (SOrd) => SOrd.dp)
    storeOrder: StoreOrders[]
}