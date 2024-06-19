import { DataSource } from "typeorm";
import { env } from "../helper";
import * as entities from "../model"
export const db = new DataSource({
    type: "sqlite",
    database: env.DB_Database || "",
    synchronize: env.DB_sync?.toLowerCase() == "true",
    logger: "advanced-console",
    logging: true,
    entities: [
        entities.Admin,
        entities.Developer,
        entities.Doc,
        entities.EndUser,
        entities.Items,
        entities.ItemsImages,
        entities.Manager,
        entities.Order_payment,
        entities.Orders,
        entities.Store,
        entities.StoreManager,
        entities.StoreOrders,
        entities.SuperAdmin,
        entities.User,
        entities.Vendor,
        entities.WCard,
        entities.bills,
        entities.deliveryPartner,
        entities.ticket

    ]
})