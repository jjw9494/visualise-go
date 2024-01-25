"use client";

import Nav from "../App-Components/Nav";
import MainPanel from "../App-Components/MainPanel";
import { Ovo } from "next/font/google";
// import data from "@/mockData.json";
import CreateNewTable from "../App-Components/CreateNewTable";
import { useEffect, useState } from "react";
import defaultData from "../../defaultData.json";

const ovo = Ovo({ subsets: ["latin"], weight: "400" });

type Data = {
	id: string;
	tableName: string;
	entryRowName: string;
	xAxisName: string;
	yAxisName: string;
	payload: { entryName: string; x: number; y: number }[];
};

export default function Dashboard() {
	const [data, setData] = useState<any>(defaultData.data.data.userTables);
	const [selectedTable, setSelectedTable] = useState<Data>(data[0]);

	const [userId, setUserId] = useState<string>("1");

	let userObject: any;

	async function fetchUserObject() {
		let fetchUserObject = await fetch(`http://localhost:8080/tables/${userId}`);
		let userObject = await fetchUserObject.json();
		if (userObject) {
			setData(userObject.data.data.userTables);
			setSelectedTable(data[0]);
			console.log(selectedTable, " setter");
		}
	}

	useEffect(() => {
		fetchUserObject();
	}, []);

	console.log(selectedTable, " table");

	function handleUpdateTable(tableId: string) {
		setSelectedTable(data.find((x: any) => x.id === tableId) || data[0]);
	}

	function handleNewRow(rowData: any) {
		setSelectedTable({
			...selectedTable,
			payload: [...selectedTable.payload, rowData],
		});
	}

	return (
		<>
			<Nav></Nav>
			<main className="px-16 pt-16 w-full">
				<div className="flex items-center justify-between">
					<h1 className={`text-[#FFF5EE] text-6xl ${ovo.className}`}>
						{selectedTable?.tableName}
					</h1>
					<CreateNewTable userId={userId} data={data} />
				</div>
				<div className="pt-4">
					<MainPanel
						data={data}
						handleUpdateTable={handleUpdateTable}
						selectedTable={selectedTable}
						userId={userId}
						handleNewRow={handleNewRow}
					></MainPanel>
				</div>
			</main>
			<footer className="h-8" />
		</>
	);
}
