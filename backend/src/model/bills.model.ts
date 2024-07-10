import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./Order.model";

@Entity()
export class bills {
    @PrimaryGeneratedColumn("identity")
    id: number;

    @Column()
    prize: string

    @Column()
    GST: string

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @OneToOne(()=> Orders, (order)=> order.bills)
    order: Orders;

}