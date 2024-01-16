import server from "./src/app.js";
import { conn, PORT } from "./src/db.js";

//*Syncing all the models at once.
const startServer = async () => {
  try {
    await conn.sync({ force: true });
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
