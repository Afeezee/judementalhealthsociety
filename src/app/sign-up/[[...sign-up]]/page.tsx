import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Admin sign up" };

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6 justify-center"><span>Admin sign up</span></div>
      <h1 className="font-display text-3xl md:text-4xl font-medium text-center mb-2">
        Create your admin account.
      </h1>
      <p className="text-center text-sm text-fg-muted mb-8">
        New accounts start with limited access. A Super Admin will promote your role from the Users & Roles panel.
      </p>
      <div className="flex justify-center">
        <SignUp
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
