import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./Item";
import { deliveryPartner } from "./DeliveryPatenters.model";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    status: string

    @Column()
    payment_status: string

    @Column()
    atNow: string;

    @OneToMany(() => Items, (item) => item.order)
    @JoinTable()
    items: Items[]

    @ManyToOne(() => deliveryPartner, (dp) => dp.ord)
    dp: deliveryPartner;
}