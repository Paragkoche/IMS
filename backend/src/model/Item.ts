import { Column, Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./Order.model";
import { Store } from "./Store.model";
import { WCard } from "./w-card";

@Entity()
export class Items {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    name: string

    @Column()
    des: string

    @Column({ default: 1 })
    Qty: number;

    @Column()
    price: string

    @OneToMany(() => ItemsImages, (ItemImages) => ItemImages.item)
    @JoinTable()
    images: ItemsImages[]

    @ManyToOne(() => Orders, (ord) => ord.items)
    @JoinTable()
    order: Orders

    @ManyToOne(() => Orders, (ord) => ord.items)
    @JoinTable()
    storeOrders: Orders

    @ManyToOne(() => Store, (stor) => stor.itemsAvailableInStore)
    store: Store;

    @OneToOne(() => WCard)
    wCard: WCard;
}

@Entity()
export class ItemsImages {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    w: string

    @Column()
    h: string

    @Column()
    url: string

    @ManyToOne(() => Items, (itm) => itm.images)
    @JoinTable()
    item: Items

}