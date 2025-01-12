"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

type FormData = z.infer<typeof formSchema>;

export default function SigninWithPassword() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: ""
	});
	const [errors, setErrors] = useState<{
		email?: string;
	}>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user types
		setErrors({});
	};

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		
		// Validate form data
		try {
			formSchema.parse(formData);
			setErrors({});
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: {[key: string]: string} = {};
				error.errors.forEach((err) => {
					if (err.path) {
						newErrors[err.path[0]] = err.message;
					}
				});
				setErrors(newErrors);
				return;
			}
		}

		try {
			setIsLoading(true);

			const result = await signIn("email", {
				email: formData.email,
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			toast.success("Magic link sent to your email");
			router.push("/auth/verify-request");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className='space-y-4'>
			<InputGroup
				label="Email"
				name="email"
				type="email"
				placeholder="Enter your email"
				value={formData.email}
				handleChange={handleChange}
				disabled={isLoading}
				error={errors.email}
			/>
			<FormButton
				text={isLoading ? "Sending magic link..." : "Send magic link"}
				disabled={isLoading}
			/>
		</form>
	);
}
