import { GraphType, SortType } from "./enums";

export type UserObject = {
	userId: string;
	userTables: UserTables;
	map: (arg1: any) => any;
};

export type UserTables = {
	length(length: any): unknown;
	id: string;
	tableName: string | undefined;
	entryRowName: string | undefined;
	xAxisName: string | undefined;
	yAxisName: string | undefined;
	payload: Payload | [];
	tableData?: UserTables;
};

export type Payload = {
	entryId?: string;
	entryName?: string;
	x?: number;
	y?: number;
	length?: () => number;
	map: () => any;
	sort?: () => any;
};

export type MainPanelProps = {
	data: UserObject;
	handleUpdateSelectedTable: any;
	selectedTable: any;
	userId: string;
	handleNewRow: (rowData: any, userId: string, tableId: string) => void;
	handleDeleteTable: () => void;
	handleDeleteRow: (rowId: string) => void;
	handleEditRow: (
		entryId: string,
		updateObject: {
			entryId: string;
			entryName: string;
			x: number;
			y: number;
		}
	) => void;
};

export type CreateNewTableProps = {
	userId: string;
	data: UserTables;
	handleNewTable: (data: UserTables, tableObject: any, userId: string) => void;
};

export type GraphProps = {
	selectedTable: any;
	graphType: GraphType | string;
	sortType: SortType | string;
};

export type GraphTypeSwitchAndDeleteProps = {
	handleGraphType: (switchVal: GraphType | string) => void;
	handleDeleteTable: () => void;
};

export type SortTypeSwitchProps = {
	handleSortType: (sortType: SortType | string) => void;
};

export type TableInputFormProps = {
	userId: string;
	handleNewRow: (rowData: any, userId: string, tableId: string) => void;
	selectedTable: UserTables;
};

export type TablePanelProps = {
	selectedTable: UserTables;
	handleDeleteRow: (rowId: string) => void;
	handleEditRow: (
		entryId: string,
		updateObject: {
			entryId: string;
			entryName: string;
			x: number;
			y: number;
		}
	) => void;
};

export type HeaderProps = {
	rowName: string | undefined;
	xAxisName: string | undefined;
	yAxisName: string | undefined;
};

export type RowProps = {
	entryId: string;
	entryName: string;
	xAxisRow: string;
	yAxisRow: string;
	handleDeleteRow: (rowId: string) => void;
	selectedTable: UserTables;
	handleEditRow: any;
};
