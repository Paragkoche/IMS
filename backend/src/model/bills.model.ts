import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class bills {
    @PrimaryGeneratedColumn("identity")
    id: number;

    @Column()
    prize: string

    @Column()
    GST: string

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

}