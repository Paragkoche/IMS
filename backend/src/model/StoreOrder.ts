import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Items } from "./Item";
import { deliveryPartner } from "./DeliveryPatenters.model";
import { Vendor } from "./vendor";
import { Order_payment } from "./order_payment";
import { Store } from "./Store.model";

@Entity()
export class StoreOrders {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  status: string;

  @Column()
  payment_status: string;

  @Column()
  atNow: string;

  @OneToMany(() => Items, (item) => item.storeOrders)
  @JoinTable()
  items: Items[];

  @ManyToOne(() => deliveryPartner, (dp) => dp.storeOrder)
  dp: deliveryPartner;

  @OneToOne(() => Order_payment)
  payment: Order_payment;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders)
  vendor: Vendor;

  @ManyToOne(() => Store, (store) => store.orders)
  store: Store;
}
