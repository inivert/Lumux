import { ReactNode } from 'react';

export interface FormButtonProps {
	text?: string;
	children?: ReactNode;
	height?: string;
	disabled?: boolean;
	onClick?: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ 
	text, 
	children, 
	height = '40px',
	disabled = false,
	onClick 
}) => {
	return (
		<button
			className="w-full bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
			style={{ height }}
			disabled={disabled}
			onClick={onClick}
		>
			{text || children}
		</button>
	);
};

export default FormButton;
