import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";

export default function SortTypeSwitch({ handleSortType }) {
	return (
		<ToggleGroup
			onValueChange={(e) => handleSortType(e)}
			defaultValue="date"
			type="single"
		>
			<ToggleGroupItem
				value="asc"
				aria-label="Toggle line chart"
				className="rounded-xl"
			>
				ASC
			</ToggleGroupItem>
			<ToggleGroupItem
				value="desc"
				aria-label="Toggle line chart"
				className="rounded-xl"
			>
				DESC
			</ToggleGroupItem>
			<ToggleGroupItem
				value="date"
				aria-label="Toggle line chart"
				className="rounded-xl"
			>
				DATE
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
