import { Column, Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./Item";
import { deliveryPartner } from "./DeliveryPatenters.model";
import { bills } from "./bills.model";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    status: string

    @Column()
    payment_status: string

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    atNow: Date;

    @OneToMany(() => Items, (item) => item.order)
    @JoinTable()
    items: Items[]

    @ManyToOne(() => deliveryPartner, (dp) => dp.ord)
    dp: deliveryPartner;

    @OneToOne(()=> bills, (bill) => bill.order)
    bills: bills;
}