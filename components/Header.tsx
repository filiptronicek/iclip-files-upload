import "tailwindcss/tailwind.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Avatar, Tooltip } from "@nextui-org/react";

const ProfileCard = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <span className="font-bold">{session.user.name || ""}</span> <br />
      <span className="text-gray-500">{session.user.email || ""}</span>
      <Button
        color="success"
        className="bg-transparent font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded"
        onClick={() => signOut()}
        auto
      >
        Log out
      </Button>
    </div>
  );
};

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center w-screen max-w-screen gap-4 px-8 mt-4">
      <h1 className="text-4xl font-bold">Interclip files</h1>
      {session ? (
        <>
          <div className="flex flex-row mx-4 gap-4 items-center justify-center">
            <Tooltip position="left" text={<ProfileCard />}>
              <Avatar
                size="large"
                src={session.user.image}
                color="error"
                bordered
              />
            </Tooltip>
          </div>
        </>
      ) : (
        <Button
          color="success"
          auto
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => signIn()}
        >
          Log in
        </Button>
      )}
    </header>
  );
};

export default Header;
