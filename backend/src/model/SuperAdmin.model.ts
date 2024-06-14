import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class SuperAdmin {
    @PrimaryGeneratedColumn("increment")
    id: number

    @OneToOne(() => User, (user) => user.superAdmin)
    user: User
}