import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class EndUser {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    age: number

    @Column()
    address: string

    @Column()
    name: string

    @Column()
    phoneNumber: string

    @OneToOne(() => User, (user) => user.endUser)
    user: User
}