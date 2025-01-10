import React from "react";

interface LoaderProps {
	style?: string;
}

const Loader = ({ style = "border-primary" }: LoaderProps) => {
	return (
		<div className="flex items-center justify-center">
			<div
				className={`h-full w-full animate-spin rounded-full border-2 border-t-transparent ${style}`}
				role="status"
				aria-label="loading"
			>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};

export default Loader;
