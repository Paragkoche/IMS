import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SuperAdmin {
    @PrimaryGeneratedColumn("increment")
    id: number
}