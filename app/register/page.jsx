"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Form from "@components/Form";




const RegisterPage = () => {
 
  const router = useRouter();

  return (
    <section>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full ">
          <h2 className="subtitle_text blue_gradient font-satoshi">
            Register for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form type="Register" />

          <p className="mt-10 text-center font-inter text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-inter font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
