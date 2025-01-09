import { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
	return (
		<div className={`rounded-10 bg-white p-10 shadow-1 dark:bg-gray-dark ${className}`}>
			{children}
		</div>
	);
}
