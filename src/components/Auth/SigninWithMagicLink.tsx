import { useState } from "react";
import FormButton from "../Common/Dashboard/FormButton";
import InputGroup from "../Common/Dashboard/InputGroup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import validateEmail from "@/libs/validateEmail";
import Loader from "../Common/Loader";
import { integrations, messages } from "../../../integrations.config";
import z from "zod";
import { motion, AnimatePresence } from "framer-motion";

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
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				onClick={e => e.stopPropagation()}
				className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl dark:shadow-gray-900/50"
			>
				<div className="mb-6">
					<div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
						<svg className="w-6 h-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
						Access Required
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-2">
						The email <span className="font-medium text-gray-900 dark:text-white">{email}</span> is not registered in our system.
					</p>
					<p className="text-gray-600 dark:text-gray-300">
						To gain access, please schedule an appointment to discuss your requirements:
					</p>
				</div>

				<div className="space-y-3">
					<a
						href="https://calendly.com/codelumus"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center w-full gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						Schedule Appointment
					</a>
					<button
						onClick={onClose}
						className="w-full py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
					>
						Close
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default function SigninWithMagicLink() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (emailSent) setEmailSent(false);
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
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label htmlFor="email" className="block text-sm font-medium text-gray-200">
						Email address
					</label>
					<div className="relative">
						<input
							id="email"
							type="email"
							name="email"
							placeholder="name@company.com"
							required
							value={email}
							onChange={handleChange}
							disabled={loading}
							className="h-12 w-full rounded-lg border border-gray-700 bg-[#1E2432]/80 px-4 text-base text-gray-100 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
							aria-describedby={emailSent ? "email-success" : undefined}
						/>
						{emailSent && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none">
									<path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
						)}
					</div>

					<AnimatePresence>
						{emailSent && (
							<motion.div
								id="email-success"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-400/10 p-2 rounded-md"
							>
								<svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
									<path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								Check your email for the magic link!
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<motion.div
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.99 }}
				>
					<button
						type="submit"
						disabled={loading}
						className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-white transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-primary/20"
					>
						{loading ? (
							<>
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
								<span>Sending magic link...</span>
							</>
						) : (
							<>
								<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
									<path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<span>Send magic link</span>
							</>
						)}
					</button>
				</motion.div>
			</form>

			<AnimatePresence>
				{showModal && (
					<AccessDeniedModal
						isOpen={showModal}
						onClose={() => setShowModal(false)}
						email={email}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
