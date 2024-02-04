import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function TablePanel({ selectedTable }) {
	return (
		<div className="flex-col w-full h-full items-start justify-start">
			<Header
				rowName={selectedTable.entryRowName}
				xAxis={selectedTable.xAxisName}
				yAxis={selectedTable.yAxisName}
			/>
			<Separator />
			<ScrollArea className=" h-[732px]  rounded-md border">
				{selectedTable.payload.map(({ entryId, entryName, x, y }) => (
					<Row
						key={entryId}
						entryId={entryId}
						entryName={entryName}
						xAxisRow={x}
						yAxisRow={y}
					/>
				))}
			</ScrollArea>
		</div>
	);
}

function Header({ rowName, xAxis, yAxis }) {
	return (
		<div className="flex w-full h-8 mx-4 my-2 items-center justify-center brightness-[.6]">
			<p className="w-[40%]">{rowName}</p>
			<p className="w-[25%]">{xAxis}</p>
			<p className="w-[25%]">{yAxis}</p>
			<div className="w-[10%]"></div>
		</div>
	);
}

function Row({ entryId, entryName, xAxisRow, yAxisRow }) {
	return (
		<div
			key={entryId}
			className="flex flex-row w-full h-8 m-4 font-[200] justify-center items-center"
		>
			<p className="w-[40%]">{entryName}</p>
			<p className="w-[25%]">{xAxisRow}</p>
			<p className="w-[25%]">{yAxisRow}</p>
			<div className="w-[10%] min-w-8">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-4 w-4 p-0">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="rounded">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => alert("Edit " + entryId)}>
							<div className="flex flex-row w-full justify-between items-center">
								Edit
								<Image
									alt="x"
									width={15}
									height={15}
									className="h-4 w-4"
									src="/images/edit-icon.png"
								/>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => alert("Delete " + entryId)}>
							<div className="flex flex-row w-full justify-between items-center">
								Delete
								<Image
									alt="x"
									width={15}
									height={15}
									className="h-4 w-4"
									src="/images/delete-icon.png"
								/>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

// entryId
// entryName
// x
// y
// <Image alt="x" width={15} height={15} src="/images/delete-icon.png" />
// <Image alt="x" width={15} height={15} src="/images/edit-icon.png" />
