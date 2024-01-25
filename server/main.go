package main

import (
	"os"
	"tableServer/configs"
	"tableServer/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    app := fiber.New()

    // Run database
    configs.ConnectDB()

    // Cors config 
    app.Use(cors.New(cors.Config{
        AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
        AllowOrigins:     "*",
        AllowCredentials: true,
        AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
    }))

    // Routes
    routes.UserRoute(app)

    // Get the port from the environment variable or use a default value (e.g., 6000)
    port := os.Getenv("PORT")
    if port == "" {
        port = "6000"
    }

    // Start the server
    app.Listen(":" + port)
}
