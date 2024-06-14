import { DataSource } from "typeorm";
import { env } from "../helper";
import { Admin, Developer, EndUser, Items, ItemsImages, Manager, Orders, Store, StoreManager, StoreOrders, SuperAdmin, User } from "../model"
export const db = new DataSource({
    type: "sqlite",
    database: env.DB_Database || "",
    synchronize: env.DB_sync?.toLowerCase() == "true",
    logger: "advanced-console",
    logging: true,
    entities: [User, Admin, Developer, EndUser, Manager, StoreManager, SuperAdmin, Store, Items, ItemsImages, Orders, StoreOrders]
})