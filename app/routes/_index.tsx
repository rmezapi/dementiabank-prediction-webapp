import { Link } from "@remix-run/react";
import { Button } from "@nextui-org/react";
import 'app/styles/Global.css';

export function links() {
  return [{ rel: "stylesheet", href: "app/styles/Global.css" }];
}

export default function Index() {
  return (
    <div className=" index min-h-dvh flex flex-col items-center justify-center min-h-screen">
      <h2 className="title"> Welcome to Cookie Theft Dementia Detection Model Interface </h2>
      <p className="text"> 
        The Cookie Theft Test was first introduced in 1972 by the Boston Diagnostic Aphasia Center. Its original purpose
        was initially designed to assess language function in patients with aphasia, typically following stroke or brain injury.
        Over time, researchers and clinicians recognized its value in assessing cognitive and linguistic abilities in patients with dementia, particularly Alzheimer's.
      </p>
      <h4> How it works: </h4>
      <p className="text"> You will see an image and be prompted to describe everything you see in the image in an audio recording which will be sent to a 
        machine learning model which has been trained on around 300 responses to the Cookie Theft Test. The model will then return
        a diagnosis. This is not meant to be a definitive diagnosis, but rather a proof of concept for a future model that would rely on 
        more data and be more accurate. For best results, make sure to be detailed and concise in your descriptions.
      </p>
      {/* button to start test */}
      <Button
        as={Link}
        to="./test"
        color="primary"
        size="lg"
        className="start-btn min-h-dvh"
      >
        Click to Begin Test
      </Button>
    </div>
  );
}
