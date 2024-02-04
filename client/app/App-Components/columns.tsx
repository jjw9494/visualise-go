"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

// May need userID when auth is implemented
export type graphData = {
	name: string;
	x: number;
	y: number;
	options: any;
};

export const columns: ColumnDef<graphData>[] = [
	{
		accessorKey: "entryName",
		header: `Entry Name`,
	},
	{
		accessorKey: "x",
		header: `X Axis`,
	},
	{
		accessorKey: "y",
		header: `Y Axis`,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ table, column, row }) => (
			<DataTableRowActions table={table} column={column} row={row} />
		),
	},
];
