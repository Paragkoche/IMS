import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class WCard {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    from: Date

    @Column()
    to: Date
}