import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { StoreOrders } from "./StoreOrder";

@Entity()
export class Vendor {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    role: string

    @OneToOne(() => User, (user) => user.vendor)
    user: User

    @OneToMany(() => StoreOrders, (SOrd) => SOrd.vendor)
    orders: StoreOrders[]

}