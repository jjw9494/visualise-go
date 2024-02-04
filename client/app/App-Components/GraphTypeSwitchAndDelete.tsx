import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export default function GraphTypeSwitchAndDelete({
	handleSwitchValue,
	handleDeleteTable,
}) {
	const [open, setOpen] = useState(false);

	return (
		<ToggleGroup
			onValueChange={(e) => handleSwitchValue(e)}
			defaultValue="line"
			type="single"
		>
			<ToggleGroupItem
				value="line"
				aria-label="Toggle line chart"
				className="rounded-xl"
			>
				<Image
					width={20}
					height={20}
					src="/images/line-chart.png"
					alt="line chart icon"
				></Image>
			</ToggleGroupItem>
			<ToggleGroupItem
				value="bar"
				aria-label="Toggle bar chart"
				className="rounded-xl"
			>
				<Image
					width={20}
					height={20}
					src="/images/bar-chart.png"
					alt="bar chart icon"
					className="mb-1"
				></Image>
			</ToggleGroupItem>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="destructive" className="ml-4 rounded-xl">
						<Image
							width={20}
							height={20}
							src="/images/delete-icon.png"
							alt="delete icon"
						/>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] bg-black">
					<DialogHeader>
						<DialogTitle>Delete Table</DialogTitle>
						<DialogDescription>
							Please confirm that you'd like to delete this table.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							type="submit"
							className="rounded w-full mt-4"
							onClick={() => {
								handleDeleteTable(), setOpen(false);
							}}
						>
							Delete Table
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ToggleGroup>
	);
}
