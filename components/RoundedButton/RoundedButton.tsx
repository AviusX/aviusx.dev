interface Props {
	color: "primary" | "secondary" | "tertiary"
	className?: string
	onClick?: () => void;
}

const RoundedButton: React.FC<Props> = props => {
	let colorClass = null;

	if (props.color === "primary") {
		colorClass = "bg-primary";
	} else if (props.color === "secondary") {
		colorClass = "bg-secondary"
	} else if (props.color === "tertiary") {
		colorClass = "bg-tertiary"
	}

	return (
		<button className={`rounded-full p-2 outline-none font-semibold text-background-dark ${colorClass} ${props.className}`} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

export default RoundedButton;
