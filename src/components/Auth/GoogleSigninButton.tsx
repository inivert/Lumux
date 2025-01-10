"use client";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";

export default function GoogleSigninButton({ text }: { text: string }) {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (loading) return;
		setLoading(true);

		try {
			const result = await signIn("google", { callbackUrl: "/", redirect: false });

			if (result?.error) {
				if (result.error.includes("invitation")) {
					toast.error("You need an invitation to sign in. Please contact an administrator.");
				} else {
					toast.error("Failed to sign in with Google");
				}
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to sign in with Google");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.button
			whileHover={{ scale: 1.01 }}
			whileTap={{ scale: 0.99 }}
			onClick={handleClick}
			disabled={loading}
			className="relative flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-700 bg-[#1E2432]/80 text-base font-medium text-gray-100 shadow-lg transition-all hover:bg-[#1E2432] hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{loading ? (
				<div className="flex items-center justify-center gap-3">
					<div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
					<span>Signing in...</span>
				</div>
			) : (
				<>
					<svg
						className="w-5 h-5 transition-transform"
						viewBox="0 0 21 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.2509 10.1944C19.2509 9.47495 19.1913 8.94995 19.0624 8.40552H10.6794V11.6527H15.6C15.5009 12.4597 14.9652 13.675 13.7747 14.4916L13.758 14.6003L16.4085 16.6126L16.5921 16.6305C18.2786 15.1041 19.2509 12.8583 19.2509 10.1944Z"
							fill="#4285F4"
						/>
						<path
							d="M10.6788 18.75C13.0895 18.75 15.1133 17.9722 16.5915 16.6305L13.774 14.4916C13.0201 15.0068 12.0081 15.3666 10.6788 15.3666C8.31773 15.3666 6.31379 13.8402 5.59943 11.7305L5.49473 11.7392L2.73868 13.8295L2.70264 13.9277C4.17087 16.786 7.18674 18.75 10.6788 18.75Z"
							fill="#34A853"
						/>
						<path
							d="M5.60014 11.7305C5.41165 11.186 5.30257 10.6027 5.30257 9.99992C5.30257 9.3971 5.41165 8.81379 5.59022 8.26935L5.58523 8.1534L2.79464 6.02954L2.70333 6.0721C2.0982 7.25823 1.75098 8.5902 1.75098 9.99992C1.75098 11.4096 2.0982 12.7415 2.70333 13.9277L5.60014 11.7305Z"
							fill="#FBBC05"
						/>
						<path
							d="M10.6789 4.63331C12.3554 4.63331 13.4864 5.34303 14.1312 5.93612L16.6511 3.525C15.1035 2.11528 13.0895 1.25 10.6789 1.25C7.18676 1.25 4.17088 3.21387 2.70264 6.07218L5.58953 8.26943C6.31381 6.15972 8.31776 4.63331 10.6789 4.63331Z"
							fill="#EB4335"
						/>
					</svg>
					<span>{text}</span>
				</>
			)}
		</motion.button>
	);
}
