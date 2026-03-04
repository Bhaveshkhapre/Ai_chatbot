import HomeMain from "./components/HomeMain";
import { getSession } from "./lib/getSession";
export default async function Home() {

  const session = await getSession()
  console.log(session)
  return (
    <>
      <HomeMain email = {session?.user?.email!} />
    </>
  );
}
