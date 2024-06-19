import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Developer {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    name: string

    @Column()
    role: string

    @OneToOne(() => User, (user) => user.developer)
    user: User

    @OneToMany(() => ticket, (tick) => tick.dev)
    tickets: ticket[]
}

@Entity()
export class ticket {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column()
    status: string
    @ManyToOne(() => Developer, (dev) => dev.tickets)
    dev: Developer
}