import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Table, Column, Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
	table: Table<TData>;
	column: Column<TData>;
	row: Row<TData>;
}

interface DataTableRowActionsProps<TData> {
	table: Table<TData>;
	column: Column<TData>;
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	// const payment = row.original;

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-4 w-4 p-0">
						<span className="sr-only">Open menu</span>
						<DotsHorizontalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem onClick={(e) => console.log(row.original.id)}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
