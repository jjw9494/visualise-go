"use client";

import Nav from "../App-Components/Nav";
import MainPanel from "../App-Components/MainPanel";
import { Ovo } from "next/font/google";
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
	payload: { entryId: string; entryName: string; x: number; y: number }[];
};

export const userIdJWT = "1";

export default function Dashboard() {
	const [data, setData] = useState<any>(defaultData.data.data.userTables);
	const [selectedTable, setSelectedTable] = useState<Data>(data[0]);
	const [userId, setUserId] = useState<string>(userIdJWT);

	async function fetchUserObject() {
		let fetchUserObject = await fetch(`http://localhost:8080/tables/${userId}`);
		let userObject = await fetchUserObject.json();
		if (userObject) {
			setData(await userObject.data.data.userTables);
			setSelectedTable(await data[0]);
		}
	}

	useEffect(() => {
		fetchUserObject();
	}, []);

	useEffect(() => {
		setSelectedTable(data[data.length - 1]);
	}, [data]);

	async function handleNewTable(
		tableData: any,
		tableObject: any,
		userId: string
	) {
		setData([...data, tableData.tableData]);
		await fetch(`http://localhost:8080/tables/${userId}`, {
			method: "POST",
			mode: "cors",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(tableObject),
		});
	}

	async function handleNewRow(rowData: any, userId: string, tableId: string) {
		await fetch(`http://localhost:8080/tables/${userId}/${tableId}`, {
			method: "POST",
			mode: "cors",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(rowData),
		});

		setSelectedTable({
			...selectedTable,
			payload: [...selectedTable.payload, rowData],
		});
	}

	async function handleUpdateSelectedTable(tableId: string) {
		const foundTable = data.find((x: any) => x.id === tableId);
		setSelectedTable(foundTable || data[data.length - 1]);
	}

	async function handleEditRow(
		entryId: string,
		updateObject: {
			entryId: string;
			entryName: string;
			x: number;
			y: number;
		}
	) {
		try {
			await fetch(
				`http://localhost:8080/tables/${userId}/${selectedTable.id}/${entryId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updateObject),
				}
			);
			let updatedPayload = selectedTable.payload;

			for (let i = 0; i < updatedPayload.length; i++) {
				if (updatedPayload[i].entryId === entryId) {
					updatedPayload[i] = updateObject;
				}
			}

			setSelectedTable({
				...selectedTable,
				payload: updatedPayload,
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function handleDeleteTable() {
		await fetch(`http://localhost:8080/tables/${userId}/${selectedTable.id}`, {
			method: "DELETE",
		});
		setData(data.filter((x: any) => x.id !== selectedTable.id));
		setSelectedTable(data[0]);
	}

	async function handleDeleteRow(rowId: string) {
		let updatedPayload = selectedTable.payload.filter(
			(x: any) => x.entryId != rowId
		);

		setSelectedTable({
			...selectedTable,
			payload: [...updatedPayload],
		});

		await fetch(
			`http://localhost:8080/tables/${userId}/${selectedTable.id}/${rowId}`,
			{
				method: "DELETE",
			}
		);
	}

	return (
		<>
			<Nav></Nav>
			<main className="px-16 pt-16 w-full">
				<div className="flex items-center justify-between">
					<h1 className={`text-[#FFF5EE] text-6xl ${ovo.className}`}>
						{selectedTable?.tableName}
					</h1>
					<CreateNewTable
						userId={userId}
						data={data}
						handleNewTable={handleNewTable}
					/>
				</div>
				<div className="pt-4">
					<MainPanel
						data={data}
						handleUpdateSelectedTable={handleUpdateSelectedTable}
						selectedTable={selectedTable}
						userId={userId}
						handleNewRow={handleNewRow}
						handleDeleteTable={handleDeleteTable}
						handleDeleteRow={handleDeleteRow}
						handleEditRow={handleEditRow}
					></MainPanel>
				</div>
			</main>
			<footer className="h-8" />
		</>
	);
}
