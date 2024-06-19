import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Manager } from "./Manager.model";
import { deliveryPartner } from "./DeliveryPatenters.model";
import { StoreManager } from "./StoreManager.model";

@Entity()
export class Doc {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string

    @Column()
    link: string;

    @ManyToOne(() => Manager, (mag) => mag.doc)
    @JoinColumn()
    manager: Manager;
    @ManyToOne(() => deliveryPartner, (dp) => dp.doc)
    deliveryP: deliveryPartner;
    @ManyToOne(() => StoreManager, (dp) => dp.doc)
    storeManager: StoreManager;

}