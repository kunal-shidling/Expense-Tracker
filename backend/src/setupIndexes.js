// import nano from "nano";
// import dotenv from "dotenv";

// dotenv.config();

// const couch = nano(process.env.COUCHDB_URL);

// async function createIndexes() {
//   try {
//     // Create index for expenses
//     const expensesDb = couch.db.use("expenses");
//     await expensesDb.createIndex({
//       index: { fields: ["userId", "date"] },
//       name: "userId-date-index",
//     });
//     console.log("✓ Expenses index created");

//     // Create index for categories
//     const categoriesDb = couch.db.use("categories");
//     await categoriesDb.createIndex({
//       index: { fields: ["userId", "name"] },
//       name: "userId-name-index",
//     });
//     console.log("✓ Categories index created");

//     // Create index for users
//     const usersDb = couch.db.use("users");
//     await usersDb.createIndex({
//       index: { fields: ["email"] },
//       name: "email-index",
//     });
//     console.log("✓ Users index created");

//     console.log("\n✅ All indexes created successfully!");
//   } catch (error) {
//     console.error("Error creating indexes:", error);
//   }
// }

// createIndexes();
import nano from "nano";
import dotenv from "dotenv";

dotenv.config();

const couch = nano(process.env.COUCHDB_URL);

async function createIndexes() {
  try {
    // Create index for expenses
    const expensesDb = couch.db.use("expenses");
    await expensesDb.createIndex({
      index: { fields: ["userId", "date"] },
      name: "userId-date-index",
    });
    console.log("✓ Expenses index created");

    // Create index for categories with createdAt for sorting
    const categoriesDb = couch.db.use("categories");
    await categoriesDb.createIndex({
      index: { fields: ["userId", "createdAt"] },
      name: "userId-createdAt-index",
    });
    console.log("✓ Categories index created");

    // Create index for users
    const usersDb = couch.db.use("users");
    await usersDb.createIndex({
      index: { fields: ["email"] },
      name: "email-index",
    });
    console.log("✓ Users index created");

    console.log("\n✅ All indexes created successfully!");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

createIndexes();