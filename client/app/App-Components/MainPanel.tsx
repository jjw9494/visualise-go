"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Separator } from "@/components/ui/separator";
import TableInputform from "./TableInputForm";
import Graph from "./Graph";
import { useState } from "react";
import GraphTypeSwitchAndDelete from "./GraphTypeSwitchAndDelete";
import SortTypeSwitch from "./SortTypeSwitch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TablePanel from "./TablePanel";

type Data = {
	id: string;
	tableName: string;
	name: string;
	x: number;
	y: number;
	options: any;
	payload: object[];
};

type MainPanelProps = {
	data: Data[];
	handleUpdateTable: (arg0: string) => void;
	selectedTable: any;
	userId: string;
};

export default function MainPanel({
	data,
	handleUpdateTable,
	selectedTable,
	userId,
	handleNewRow,
	handleDeleteTable,
	handleDeleteRow,
}: MainPanelProps) {
	const [switchValue, setSwitchValue] = useState<string>("line");
	const [sort, setSort] = useState("default");

	function handleSortType(sortType: string) {
		setSort(sortType);
	}

	function handleSwitchValue(switchVal: string) {
		setSwitchValue(switchVal);
	}

	return (
		<div className="flex gap-12">
			<div className="flex-1">
				<ResizablePanelGroup
					direction="horizontal"
					className="min-h-[772px] max-h-[772px] flex-1 rounded border bg-black shadow-std"
				>
					<ResizablePanel defaultSize={60}>
						<div className="flex h-full items-center justify-center flex-col">
							<div className="pr-8 pt-8 flex-1 w-full">
								<Graph
									switchValue={switchValue}
									data={selectedTable}
									sort={sort}
								></Graph>
							</div>
							<Separator
								orientation="horizontal"
								className="w-full"
							></Separator>
							<div className="flex justify-between py-4 w-full px-12">
								<div className="h-1"></div>
								<div className="flex w-full item-between space-between gap-2 justify-between">
									<SortTypeSwitch handleSortType={handleSortType} />
									<GraphTypeSwitchAndDelete
										handleDeleteTable={handleDeleteTable}
										handleSwitchValue={handleSwitchValue}
									/>
								</div>
							</div>
							<Separator
								orientation="horizontal"
								className="w-full"
							></Separator>
							<TableInputform
								data={selectedTable}
								userId={userId}
								handleNewRow={handleNewRow}
							></TableInputform>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={40}>
						<div className="flex h-full items-center justify-center">
							{/* <DataTable
							handleDeleteRow={handleDeleteRow}
								columns={columns}
								data={selectedTable?.payload}
								tableHeaders={selectedTable}
							></DataTable> */}
							<TablePanel selectedTable={selectedTable} />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>{" "}
			</div>
			<div>
				<Select
					onValueChange={(e: any) => {
						handleUpdateTable(e);
					}}
				>
					<SelectTrigger className="w-[320px] border-none">
						<SelectValue placeholder={selectedTable.tableName} />
					</SelectTrigger>
					<SelectContent className="min-h-[726px] shadow-std rounded bg-black">
						{data.map((x) => (
							<SelectItem key={x.id} value={x.id}>
								<div className="flex w-[300px] justify-between">
									{x.tableName}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
