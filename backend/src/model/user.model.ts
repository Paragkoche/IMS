import { compare, genSalt, hash } from "bcrypt";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SuperAdmin } from "./SuperAdmin.model";
import { Admin } from "./Admin.model";
import { Developer } from "./Developer.model";
import { Manager } from "./Manager.model";
import { EndUser } from "./EndUser.model";
import { StoreManager } from "./StoreManager.model";
import { Vendor } from "./vendor";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  // ref by https://stackoverflow.com/questions/64941148/node-js-add-created-at-and-updated-at-in-entity-of-typeorm

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @OneToOne(() => SuperAdmin, (superAdmin) => superAdmin.user)
  @JoinColumn()
  superAdmin: SuperAdmin;

  @OneToOne(() => Admin, (admin) => admin.user)
  @JoinColumn()
  admin: Admin;

  @OneToOne(() => Developer, (dev) => dev.user)
  @JoinColumn()
  developer: Developer;

  @OneToOne(() => Manager, (manager) => manager.user)
  @JoinColumn()
  manager: Manager;

  @OneToOne(() => EndUser, (user) => user.user)
  @JoinColumn()
  endUser: EndUser;

  @OneToOne(() => StoreManager, (StoreManager) => StoreManager.user)
  @JoinColumn()
  storeManage: StoreManager;

  @OneToOne(() => Vendor, (vendor) => vendor.user)
  @JoinColumn()
  vendor: Vendor;

  @BeforeInsert()
  async hashPassword() {
    let salt = await genSalt(14);
    this.password = await hash(this.password, salt);
  }

  async checkPassword(planPassword: string) {
    console.log(this.password);

    return await compare(planPassword, this.password);
  }

  toJson() {
    let { password, ...data } = this;
    return data;
  }
}
