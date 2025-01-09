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

export default function SigninWithMagicLink() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

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

			const data = await res.json();
			return data.hasAccess;
		} catch (error) {
			console.error('Error checking email access:', error);
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

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

		// Check if email has access (either in users or invitations table)
		const hasAccess = await checkEmailAccess(email);
		if (!hasAccess) {
			setLoading(false);
			return toast.error("This email does not have access. Please contact the administrator.");
		}

		// Proceed with magic link signin
		signIn("email", {
			redirect: false,
			email,
		})
			.then((callback) => {
				if (callback?.ok) {
					toast.success("Magic link sent to your email");
					setEmail("");
					setLoading(false);
				}
			})
			.catch((error) => {
				toast.error(error);
				setLoading(false);
			});
	};

	return (
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
				/>

				<FormButton height='50px'>
					{loading ? (
						<>
							Checking <Loader style='border-white dark:border-dark' />
						</>
					) : (
						"Send magic link"
					)}
				</FormButton>
			</div>
		</form>
	);
}
