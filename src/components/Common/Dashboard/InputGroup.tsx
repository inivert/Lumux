"use client";
import { ChangeEvent } from 'react';

export interface InputGroupProps {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	value: string;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	error?: string;
	disabled?: boolean;
	height?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
	label,
	name,
	type,
	placeholder,
	value,
	handleChange,
	required = false,
	error,
	disabled = false,
	height = '40px'
}) => {
	return (
		<div className="mb-4">
			<label className="mb-2.5 block font-medium text-black dark:text-white">
				{label}
			</label>
			<div className="relative">
				<input
					type={type}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					required={required}
					disabled={disabled}
					style={{ height }}
					className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
						error ? 'border-danger' : 'border-stroke'
					}`}
				/>
				{error && (
					<span className="mt-1 text-sm text-danger">
						{error}
					</span>
				)}
			</div>
		</div>
	);
};

export default InputGroup;
