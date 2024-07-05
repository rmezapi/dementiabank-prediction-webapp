import { Link } from "@remix-run/react";
import { Button } from "@nextui-org/react";
import 'app/styles/Global.css';

export function links() {
  return [{ rel: "stylesheet", href: "app/styles/Global.css" }];
}

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8"> Welcome to Cookie Theft Dementia Detection Model Interface </h1>
      {/* button to start test */}
      <Button
        as={Link}
        to="./test"
        color="primary"
        size="lg"
        className="btn"
      >
        Click to Begin Test
      </Button>
    </div>
  );
}
