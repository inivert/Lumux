"use client";
import { useState } from "react";

interface InputGroupProps {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	value: string | number;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}

const InputGroup = ({
	label,
	name,
	type,
	placeholder,
	value,
	handleChange,
	className = "",
}: InputGroupProps) => {
	return (
		<div className="group">
			<label
				htmlFor={name}
				className="mb-2.5 block font-medium text-black dark:text-white transition-colors duration-200"
			>
				{label}
			</label>
			<div className="relative">
				<input
					type={type}
					placeholder={placeholder}
					name={name}
					value={value}
					onChange={handleChange}
					className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary ${className} transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500`}
				/>
			</div>
		</div>
	);
};

export default InputGroup;
