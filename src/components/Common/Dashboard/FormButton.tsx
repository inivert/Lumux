import React from 'react';
import Loader from '../Loader';

interface FormButtonProps {
	loading?: boolean;
	text: string;
	disabled?: boolean;
	className?: string;
}

const FormButton = ({
	loading = false,
	text,
	disabled = false,
	className = "",
}: FormButtonProps) => {
	return (
		<button
			type="submit"
			disabled={disabled || loading}
			className={`inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-4 font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-3 dark:disabled:bg-strokedark ${className} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50`}
		>
			{loading ? (
				<>
					<span className="h-5 w-5">
						<Loader />
					</span>
					<span>Processing...</span>
				</>
			) : (
				<span>{text}</span>
			)}
		</button>
	);
};

export default FormButton;
