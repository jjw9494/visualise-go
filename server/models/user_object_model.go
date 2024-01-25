package models

type Entry struct {
	EntryId    string    `json:"entryId" validate:"required"`
	EntryName  string `json:"entryName" validate:"required"`
	X          int    `json:"x" validate:"required"`
	Y          int    `json:"y" validate:"required"`
}

type UserTable struct {
	Id           string  `json:"id" validate:"required"`
	TableName    string  `json:"tableName" validate:"required"`
	EntryRowName string  `json:"entryRowName" validate:"required"`
	XAxisName    string  `json:"xAxisName" validate:"required"`
	YAxisName    string  `json:"yAxisName" validate:"required"`
	Payload      []Entry `json:"payload"`
}

type User struct {
	UserId     string      `json:"userId" bson:"userId" validate:"required"`
	UserTables []UserTable `json:"userTables,omitempty" bson:"userTables"`
}
