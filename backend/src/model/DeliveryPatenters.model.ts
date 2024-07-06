import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doc } from "./emplyeeDoc";
import { Orders } from "./Order.model";
import { StoreOrders } from "./StoreOrder";
import { User } from "./user.model";

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
  bond: Date;

  @Column()
  liveLocation: string;

  @OneToMany(() => Doc, (doc) => doc.deliveryP)
  doc: Doc[];

  @OneToMany(() => Orders, (ord) => ord.dp)
  ord: Orders[];

  @OneToMany(() => StoreOrders, (SOrd) => SOrd.dp)
  storeOrder: StoreOrders[];

  @OneToOne(() => User, (user) => user)
  user: User;
}
