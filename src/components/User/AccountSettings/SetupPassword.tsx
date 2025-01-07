"use client";
import { useState } from "react";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import z from "zod";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[@$!%*?&]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SetupPassword() {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please login first!");
      return;
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/user/setup-password", {
        password: data.password,
        email: session.user.email,
      });

      toast.success("Password set successfully!");
      setData({
        password: "",
        confirmPassword: "",
      });
      
      // Update session to reflect that password has been set
      await update({
        ...session,
        user: {
          ...session.user,
          hasPassword: true,
        },
      });

    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[525px]">
      <Card>
        <div className="mb-9">
          <h3 className="font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white">
            Set Up Your Password
          </h3>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Please set up a password for your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5.5">
          <InputGroup
            label="New password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={data.password}
            handleChange={handleChange}
            required={true}
          />

          <InputGroup
            label="Confirm password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            value={data.confirmPassword}
            handleChange={handleChange}
            required={true}
          />

          <FormButton>
            {loading ? (
              <>
                Setting up <Loader style="border-white" />
              </>
            ) : (
              "Set Password"
            )}
          </FormButton>
        </form>
      </Card>
    </div>
  );
} 