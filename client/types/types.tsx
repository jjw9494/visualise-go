type Payload = {
	entryId: string;
	entryName: string;
	x: number;
	y: number;
};
type UserTables = {
	id: string;
	tableName: string;
	entryRowName: string;
	xAxisName: string;
	yAxisName: string;
	payload: Payload;
};

type UserObject = {
    userId: string;
    userTables: UserTables
}