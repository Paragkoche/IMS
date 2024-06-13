import { compare, genSalt, hash } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    username: string;


    // ref by https://stackoverflow.com/questions/64941148/node-js-add-created-at-and-updated-at-in-entity-of-typeorm

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;


    @BeforeInsert()
    async hashPassword() {
        let salt = await genSalt(14);
        this.password = await hash(this.password, salt);
    }

    async checkPassword(planPassword: string) {
        return await compare(planPassword, this.password);
    }
}