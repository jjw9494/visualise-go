import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type Data = {
	id: string;
	tableId: string;
	tableName: string;
	name: string;
	options: any;
	payload: Object[];
	entryRowName: string;
	x: string;
	y: string;
};

type TableInputProps = {
	data: Data[];
	userId: string;
	tableId: string;
	entryId: string;
};

export default function TableInputform({
	data,
	userId,
	handleNewRow,
	selectedTable,
}: TableInputProps) {
	const [entryInput, setEntryInput] = useState<string>();
	const [xInput, setXInput] = useState<string>();
	const [yInput, setYInput] = useState<string>();

	function handleEntryInput(e: any) {
		setEntryInput(e.target.value);
	}

	function handleXInput(e: any) {
		setXInput(e.target.value);
	}

	function handleYInput(e: any) {
		setYInput(e.target.value);
	}

	async function createRow() {
		let rowData = {
			entryId: String(data.payload.length),
			entryName: entryInput,
			x: Number(xInput),
			y: Number(yInput),
		};

		if (entryInput == undefined) {
			return toast("Error", {
				description: "Please input an entry name",
			});
		}

		if (xInput == undefined) {
			return toast("Error", {
				description: "Please enter a valid input into the x-axis",
			});
		}

		if (yInput == undefined) {
			return toast("Error", {
				description: "Please enter a valid input into the y-axis",
			});
		}

		try {
			let newRow = await fetch(
				`http://localhost:8080/tables/${userId}/${data.id}`,
				{
					method: "POST",
					mode: "cors",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json;charset=UTF-8",
					},
					body: JSON.stringify(rowData),
				}
			);

			await handleNewRow(rowData);
			// setEntryInput(undefined);
			// setXInput(undefined);
			// setYInput(undefined);
			return newRow.json();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="flex flex-col w-full place-self-end p-8">
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="entryname">{data.entryRowName}</Label>
				<Input
					type="text"
					id="entryname"
					placeholder={`${data.entryRowName}`}
					value={entryInput}
					onChange={handleEntryInput}
					className="rounded"
				/>
			</div>

			<div className="flex gap-4 py-4 w-full">
				<div className="w-full">
					<Label htmlFor="xaxis">{data?.xAxisName}</Label>
					<Input
						type="number"
						id="xaxis"
						placeholder={`${data.xAxisName}`}
						value={xInput}
						onChange={handleXInput}
						className="rounded"
					/>
				</div>

				<div className="w-full">
					<Label htmlFor="yaxis">{data?.yAxisName}</Label>
					<Input
						type="number"
						id="yaxis"
						placeholder={`${data.yAxisName}`}
						value={yInput}
						onChange={handleYInput}
						className="rounded"
					/>
				</div>
			</div>
			<Button
				className="flex self-center gap-4 rounded w-1/2"
				onClick={() => createRow()}
			>
				Create New Item
				<Image
					alt="add icon"
					width={20}
					height={20}
					src="/images/plus-icon.png"
				></Image>
			</Button>
		</div>
	);
}
