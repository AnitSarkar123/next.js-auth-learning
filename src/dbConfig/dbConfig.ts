// import mongoose from "mongoose";
// export async function connect() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI!);
//     const connection = mongoose.connection;
//     connection.on("connected", () => {
//       console.log("Database connected");
//     });
//     connection.on("error", (error) => {
//       console.log("Error connecting to database");
//       console.log(error);
//       process.exit();
//     });
//   } catch (error) {
//     console.log("Error connecting to database");
//     console.log(error);
//   }
// }
import mongoose from "mongoose";

export async function connect() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Database connected");
    });

    connection.on("error", (error) => {
      console.error("Error connecting to database:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}
