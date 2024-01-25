import Image from "next/image";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function GraphTypeSwitch({ handleSwitchValue }) {
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
		</ToggleGroup>
	);
}
