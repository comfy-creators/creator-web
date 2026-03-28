/** @format */
import { Button } from "@/components/ui/button";
import { UserButton, SignOutButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Creator Web</h1>
      <p className="text-muted-foreground tracking-tight">
        Authenticated with Clerk
      </p>
      <Button render={<SignOutButton>Sign Out</SignOutButton>}></Button>
      <UserButton showName />
    </div>
  );
};

export default Home;
