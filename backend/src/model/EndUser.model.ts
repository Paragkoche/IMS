import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}