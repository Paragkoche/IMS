import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order_payment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  price: string;
  @Column()
  method: string;
}
