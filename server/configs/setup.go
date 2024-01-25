package configs

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

func init() {
    var err error
    DB, err = ConnectDB()
    if err != nil {
        log.Fatal(err)
    }
}

// Your ConnectDB function (updated according to the latest MongoDB Go driver)
func ConnectDB() (*mongo.Client, error) {
    clientOptions := options.Client().ApplyURI(EnvMongoURI())

    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        return nil, err
    }

    err = client.Ping(context.Background(), nil)
    if err != nil {
        return nil, err
    }

    fmt.Println("Connected to MongoDB")
    return client, nil
}


//getting database collections
func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
    collection := client.Database("test").Collection(collectionName)
    return collection
}