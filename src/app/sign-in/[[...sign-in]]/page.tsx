import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Admin sign in" };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6 justify-center"><span>Admin sign in</span></div>
      <h1 className="font-display text-3xl md:text-4xl font-medium text-center mb-8">
        Welcome back.
      </h1>
      <div className="flex justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-hairline",
            },
          }}
        />
      </div>
    </div>
  );
}
