import { useState } from "react";
import FormButton from "../Common/Dashboard/FormButton";
import InputGroup from "../Common/Dashboard/InputGroup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import validateEmail from "@/libs/validateEmail";
import Loader from "../Common/Loader";
import { integrations, messages } from "../../../integrations.config";
import z from "zod";

const schema = z.object({
	email: z.string().email(),
});

interface AccessDeniedModalProps {
	isOpen: boolean;
	onClose: () => void;
	email: string;
}

function AccessDeniedModal({ isOpen, onClose, email }: AccessDeniedModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
				<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
					Access Required
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mb-4">
					The email <span className="font-medium">{email}</span> is not registered in our system.
				</p>
				<p className="text-gray-600 dark:text-gray-300 mb-6">
					To gain access, please schedule an appointment to discuss your requirements:
				</p>
				<a
					href="https://calendly.com/codelumus"
					target="_blank"
					rel="noopener noreferrer"
					className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-4 transition-colors"
				>
					Schedule Appointment
				</a>
				<button
					onClick={onClose}
					className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
				>
					Close
				</button>
			</div>
		</div>
	);
}

export default function SigninWithMagicLink() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const checkEmailAccess = async (email: string) => {
		try {
			const res = await fetch('/api/auth/check-email-access', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (!res.ok) {
				console.error('Error response:', await res.text());
				toast.error("Failed to verify email access. Please try again.");
				return false;
			}

			const data = await res.json();
			console.log('Email access check response:', data);

			if (!data.hasAccess) {
				if (data.reason === 'no_user') {
					setShowModal(true);
					return false;
				}
				if (data.reason === 'no_invitation') {
					toast.error(
						"Your email is not associated with an active invitation. Please contact support.",
						{ duration: 4000 }
					);
					return false;
				}
				toast.error("Access denied. Please contact support.");
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error checking email access:', error);
			toast.error("Failed to verify email access. Please try again.");
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setEmailSent(false);

		if (!integrations.isAuthEnabled) {
			setLoading(false);
			return toast.error(messages.auth);
		}

		const result = schema.safeParse({ email });

		if (!result.success) {
			setLoading(false);
			return toast.error("Please enter a valid email address.");
		}

		if (!validateEmail(email)) {
			setLoading(false);
			return toast.error("Please enter a valid email address.");
		}

		const hasAccess = await checkEmailAccess(email);
		if (!hasAccess) {
			setLoading(false);
			return;
		}

		try {
			const result = await signIn("email", {
				redirect: false,
				email,
			});

			if (result?.error) {
				toast.error(result.error);
			} else {
				setEmailSent(true);
				toast.success("Magic link sent to your email");
				setEmail("");
			}
		} catch (error) {
			toast.error("Failed to send magic link. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className='mb-5 space-y-4'>
					<InputGroup
						label='Email'
						placeholder='Enter your email'
						type='email'
						name='email'
						required
						height='50px'
						value={email}
						handleChange={handleChange}
						disabled={loading}
					/>

					{emailSent && (
						<div className="text-sm text-green-600 dark:text-green-400 mt-2">
							Check your email for the magic link!
						</div>
					)}

					<FormButton height='50px' disabled={loading}>
						{loading ? (
							<>
								Sending magic link <Loader style='border-white dark:border-dark' />
							</>
						) : (
							"Send magic link"
						)}
					</FormButton>
				</div>
			</form>

			<AccessDeniedModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				email={email}
			/>
		</>
	);
}
