import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./Item";

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


}