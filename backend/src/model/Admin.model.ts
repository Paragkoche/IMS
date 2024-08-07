import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  role: string;

  @Column({ default: false })
  firstTimeLogin: boolean;

  @OneToOne(() => User, (user) => user.admin)
  user: User;
}
