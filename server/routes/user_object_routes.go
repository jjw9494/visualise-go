package routes

import (
	controllers "tableServer/controller"

	"github.com/gofiber/fiber/v2"
)

func UserRoute(app *fiber.App) {
    app.Get("/tables/:userId", controllers.GetUserObject) 
	app.Post("/tables", controllers.CreateUser)
	app.Post("/tables/:userId", controllers.CreateTable)
	app.Post("/tables/:userId/:tableId", controllers.CreateRow)
	app.Delete("/tables/:userId", controllers.DeleteUser)
	app.Delete("/tables/:userId/:tableId", controllers.DeleteTable)
	app.Delete("/tables/:userId/:tableId/:entryId", controllers.DeleteRow)
	app.Put("/tables/:userId/:tableId/:entryId", controllers.UpdateRow)
}