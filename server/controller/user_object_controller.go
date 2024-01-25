package controllers

import (
	"context"
	"net/http"
	"tableServer/configs"
	"tableServer/models"
	"tableServer/responses"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"

	// "go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "userobjects")
var validate = validator.New()

// Get whole user object -> userId
func GetUserObject(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    userId := c.Params("userId")
    var user models.User
    defer cancel()

    // objId, _ := primitive.ObjectIDFromHex(userId)
	var userIdString string = string(userId)

    err := userCollection.FindOne(ctx, bson.M{"userId": userIdString}).Decode(&user)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": user}})
}

// Create a new user
func CreateUser(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    var user models.User
    defer cancel()

    //validate the request body
    if err := c.BodyParser(&user); err != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    //use the validator library to validate required fields
    if validationErr := validate.Struct(&user); validationErr != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
    }

    newUser := models.User{
        UserId:     user.UserId,
        UserTables: user.UserTables,
    }

    result, err := userCollection.InsertOne(ctx, newUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": result}})
}

// Add a new table to a user -> userId
func CreateTable(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var table models.UserTable
    if err := c.BodyParser(&table); err != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    if validationErr := validate.Struct(&table); validationErr != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
    }

	userId := c.Params("userId")
	var userIdString string = string(userId)

    // Find the user by ID
    userFilter := bson.D{{Key: "userId", Value: userIdString}} 
    var existingUser models.User
    err := userCollection.FindOne(ctx, userFilter).Decode(&existingUser)
    if err != nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    // Add the new table to the user's UserTables field
    existingUser.UserTables = append(existingUser.UserTables, table)

    // Update the user in the database
    updateResult, err := userCollection.ReplaceOne(ctx, userFilter, existingUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": updateResult}})
}

// Add a new row to a user's table -> userId -> tableId
func CreateRow(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var newRow models.Entry
    if err := c.BodyParser(&newRow); err != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    userId := c.Params("userId")
    tableId := c.Params("tableId")

    // Find the user by ID
    userFilter := bson.D{{Key: "userId", Value: userId}}
    var existingUser models.User
    err := userCollection.FindOne(ctx, userFilter).Decode(&existingUser)
    if err != nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    // Find the table by ID in the user's UserTables
    var foundTable *models.UserTable
    for i, table := range existingUser.UserTables {
        if table.Id == tableId {
            foundTable = &existingUser.UserTables[i]
            break
        }
    }

    if foundTable == nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Table not found"}})
    }

    // Add the new row to the table's payload
    foundTable.Payload = append(foundTable.Payload, newRow)

    // Update the user in the database
    updateResult, err := userCollection.ReplaceOne(ctx, userFilter, existingUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": updateResult}})
}

// Update row -> userId, tableId, entryId
func UpdateRow(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    userId := c.Params("userId")
    tableId := c.Params("tableId")
    entryId := c.Params("entryId")

    // Find the user by ID
    userFilter := bson.D{{Key: "userId", Value: userId}}
    var existingUser models.User
    err := userCollection.FindOne(ctx, userFilter).Decode(&existingUser)
    if err != nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    // Find the table by ID in the user's UserTables
    var foundTable *models.UserTable
    for i, table := range existingUser.UserTables {
        if table.Id == tableId {
            foundTable = &existingUser.UserTables[i]
            break
        }
    }

    if foundTable == nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Table not found"}})
    }

    // Find the index of the entry in the table's payload
    var entryIndex = -1
    for i, entry := range foundTable.Payload {
        if entry.EntryId == entryId {
            entryIndex = i
            break
        }
    }

    if entryIndex == -1 {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Entry not found"}})
    }

    // Parse the updated entry from the request body
    var updatedEntry models.Entry
    if err := c.BodyParser(&updatedEntry); err != nil {
        return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    // Update the entry in the table's payload
    foundTable.Payload[entryIndex] = updatedEntry

    // Update the user in the database
    updateResult, err := userCollection.ReplaceOne(ctx, userFilter, existingUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": updateResult}})
}

//Delete the user in the database -> userId
func DeleteUser(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    userId := c.Params("userId")

    // Find and delete the user by ID
    userFilter := bson.D{{Key: "userId", Value: userId}}
    deleteResult, err := userCollection.DeleteOne(ctx, userFilter)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    // Check if any document was deleted
    if deleteResult.DeletedCount == 0 {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": deleteResult}})
}


// Delete a table in the database -> userId, tableId
func DeleteTable(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    userId := c.Params("userId")
    tableId := c.Params("tableId")

    // Find the user by ID
    userFilter := bson.D{{Key: "userId", Value: userId}}
    var existingUser models.User
    err := userCollection.FindOne(ctx, userFilter).Decode(&existingUser)
    if err != nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    // Find the index of the table in the user's UserTables
    var tableIndex = -1
    for i, table := range existingUser.UserTables {
        if table.Id == tableId {
            tableIndex = i
            break
        }
    }

    if tableIndex == -1 {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Table not found"}})
    }

    // Remove the table from the user's UserTables
    existingUser.UserTables = append(existingUser.UserTables[:tableIndex], existingUser.UserTables[tableIndex+1:]...)

    // Update the user in the database
    updateResult, err := userCollection.ReplaceOne(ctx, userFilter, existingUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": updateResult}})
}


// Delete a row in the database -> userId, tableId, entryId
func DeleteRow(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    userId := c.Params("userId")
    tableId := c.Params("tableId")
    entryId := c.Params("entryId")

    // Find the user by ID
    userFilter := bson.D{{Key: "userId", Value: userId}}
    var existingUser models.User
    err := userCollection.FindOne(ctx, userFilter).Decode(&existingUser)
    if err != nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "User not found"}})
    }

    // Find the table by ID in the user's UserTables
    var foundTable *models.UserTable
    for i, table := range existingUser.UserTables {
        if table.Id == tableId {
            foundTable = &existingUser.UserTables[i]
            break
        }
    }

    if foundTable == nil {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Table not found"}})
    }

    // Find the index of the entry in the table's payload
    var entryIndex = -1
    for i, entry := range foundTable.Payload {
        if entry.EntryId == string(entryId) {
			{
            entryIndex = i
            break
        }
    }}

    if entryIndex == -1 {
        return c.Status(http.StatusNotFound).JSON(responses.UserResponse{Status: http.StatusNotFound, Message: "error", Data: &fiber.Map{"data": "Entry not found"}})
    }

    // Remove the entry from the table's payload
    foundTable.Payload = append(foundTable.Payload[:entryIndex], foundTable.Payload[entryIndex+1:]...)

    // Update the user in the database
    updateResult, err := userCollection.ReplaceOne(ctx, userFilter, existingUser)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
    }

    return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": updateResult}})
}
