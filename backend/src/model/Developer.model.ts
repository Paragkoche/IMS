import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Developer {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    name: string

    @Column()
    role: string
}