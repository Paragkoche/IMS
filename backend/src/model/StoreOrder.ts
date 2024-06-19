import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./Item";
import { deliveryPartner } from "./DeliveryPatenters.model";
import { Vendor } from "./vendor";

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

    @ManyToOne(() => deliveryPartner, (dp) => dp.storeOrder)
    dp: deliveryPartner;
    @ManyToOne(() => Vendor, (vendor) => vendor.orders)
    vendor: Vendor
}