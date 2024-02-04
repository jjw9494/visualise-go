import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNewTable({ userId, data, handleNewTable }) {
	const [tableName, setTableName] = useState<string>();
	const [entryName, setEntryName] = useState<string>();
	const [xName, setXName] = useState<string>();
	const [yName, setYName] = useState<string>();
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	function handleTableNameInput(e: any) {
		setTableName(e.target.value);
	}

	function handleEntryNameInput(e: any) {
		setEntryName(e.target.value);
	}

	function handleXNameInput(e: any) {
		setXName(e.target.value);
	}

	function handleYNameInput(e: any) {
		setYName(e.target.value);
	}

	async function createTable() {
		let tableData = {
			id: String(data.length),
			tableName: tableName,
			entryRowName: entryName,
			xAxisName: xName,
			yAxisName: yName,
			payload: [],
		};

		if (tableName == undefined) {
			return toast("Error", {
				description: "Please input a valid table name",
			});
		}

		if (entryName == undefined) {
			return toast("Error", {
				description: "Please enter a valid input for the entry row name",
			});
		}

		if (xName == undefined) {
			return toast("Error", {
				description: "Please enter a valid input for the x-axis",
			});
		}

		if (yName == undefined) {
			return toast("Error", {
				description: "Please enter a valid input into the y-axis",
			});
		}

		try {
			let newRow = await fetch(`http://localhost:8080/tables/${userId}`, {
				method: "POST",
				mode: "cors",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				body: JSON.stringify(tableData),
			});

			// await handleNewRow(rowData);
			setTableName("");
			setEntryName("");
			setXName("");
			setYName("");
			setMenuOpen(false);
			await handleNewTable({ tableData });
			return newRow.json();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<Dialog open={menuOpen}>
				<DialogTrigger asChild>
					<Button
						className="flex gap-4 w-[320px] rounded shadow-std"
						onClick={() => setMenuOpen(true)}
					>
						Create New Table
						<Image
							alt="add icon"
							width={20}
							height={20}
							src="/images/plus-icon.png"
						></Image>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md bg-black rounded-xl">
					<DialogHeader>
						<DialogTitle>Create New Table</DialogTitle>
						<DialogDescription>
							Create a new table to start visualising your data. Input a table
							name as well as axis and entry labels below.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col ">
						<div className="grid flex-1 gap-2">
							<div className="w-full mb-2">
								<Label htmlFor="tablename">Table Name</Label>
								<Input
									type="text"
									id="tablename"
									placeholder="Table Name"
									value={tableName}
									onChange={handleTableNameInput}
									className="rounded"
								/>
							</div>

							<div className="w-full">
								<Label htmlFor="entryname">Entry Name</Label>
								<Input
									type="text"
									id="entryname"
									placeholder="Entry Name"
									value={entryName}
									onChange={handleEntryNameInput}
									className="rounded"
								/>
							</div>

							<div className="w-full">
								<Label htmlFor="xaxis">X Axis</Label>
								<Input
									type="text"
									id="xaxis"
									placeholder="X Axis"
									value={xName}
									onChange={handleXNameInput}
									className="rounded"
								/>
							</div>

							<div className="w-full mb-4 ">
								<Label htmlFor="yaxis">Y Axis</Label>
								<Input
									type="text"
									id="yaxis"
									placeholder="Y Axis"
									value={yName}
									onChange={handleYNameInput}
									className="rounded"
								/>
							</div>
						</div>
						<Button
							type="submit"
							className=" mb-4 self-center w-full rounded"
							onClick={() => {
								createTable();
							}}
						>
							<span>Submit</span>
						</Button>
						<Button
							type="button"
							className="px-3 self-center w-full rounded"
							onClick={() => setMenuOpen(false)}
							variant="ghost"
						>
							<span>Cancel</span>
						</Button>
					</div>
					{/* <DialogFooter className="sm:justify-start">
						<DialogClose
							asChild
							onClick={() => setMenuOpen(false)}
						></DialogClose>
					</DialogFooter> */}
				</DialogContent>
			</Dialog>
		</div>
	);
}
