"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { createApiKey } from "@/actions/api-key";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreateToken() {
	const ref = useRef<HTMLFormElement>(null);
	const [tokenName, setTokenName] = useState("");

	const handleSubmit = async (formData: FormData) => {
		try {
			await createApiKey(tokenName);
			toast.success("Token created successfully");
			setTokenName("");
		} catch (error) {
			toast.error("Unable to create token");
		}
	};

	return (
		<div className='lg:w-2/6'>
			<Card>
				<div className='mb-6'>
					<h3 className='mb-2.5 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
						Want to use the API?
					</h3>
					<p className='text-body'>Create a new token to get the access.</p>
				</div>

				<form
					ref={ref}
					action={handleSubmit}
					className='space-y-5.5'
				>
					<InputGroup
						label='Token name'
						name='token'
						placeholder='Enter a token name'
						type='text'
						required={true}
						value={tokenName}
						handleChange={(e) => setTokenName(e.target.value)}
					/>

					<FormButton text="Create Token" />
				</form>
			</Card>
		</div>
	);
}
