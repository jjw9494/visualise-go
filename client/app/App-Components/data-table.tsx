"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

import * as React from "react";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[] & { payload: TData[] };
	handleDeleteRow: (string) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	handleDeleteRow,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	console.log(table);

	return (
		<div className="rounded-md border w-full">
			<Table>
				<ScrollArea className=" h-[772px]  rounded-md border">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											// onClick={(e) => console.log(e.target.entryid)}
											key={cell.id}
										>
											{flexRender(cell.column.columnDef.cell, {
												...cell.getContext(),
												handleDeleteRow,
											})}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</ScrollArea>
			</Table>
			<Button onClick={() => handleDeleteRow(20)} />
		</div>
	);
}
