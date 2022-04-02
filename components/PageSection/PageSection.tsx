interface Props {
	className?: string;
}

const PageSection: React.FC<Props> = props => (
	<div className={`flex flex-col dark dark:text-white h-screen ${props.className}`}>
		{props.children}
	</div>
);

export default PageSection;
