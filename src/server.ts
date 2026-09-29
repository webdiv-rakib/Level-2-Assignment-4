import app from "./app";
import config from "./config";

const port = config.port
async function main() {
    try {
        // await prisma.$connect();
        console.log("Connected to the database successfully");
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        })
    } catch (error) {
        console.log("Error starting the server:", error);
        // await prisma.$disconnect();
        process.exit(1);
    }
};
main();