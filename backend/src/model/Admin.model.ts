import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    role: string

    @OneToOne(() => User, (user) => user.admin)
    user: User

}