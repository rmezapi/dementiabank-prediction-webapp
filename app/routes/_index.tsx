import { Link } from "@remix-run/react";
import { Button } from "@nextui-org/react";
import styles from '~/styles/Global.css';

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8"> Welcome to Dementia Detection AI</h1>
      <Button
        as={Link}
        to="./test"
        color="primary"
        size="lg"
        className="btn"
      >
        Begin Test
      </Button>
    </div>
  );
}
