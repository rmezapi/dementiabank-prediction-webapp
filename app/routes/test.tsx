import { ActionFunctionArgs, json } from '@remix-run/node';
import { 
  Button, 
  Image } from "@nextui-org/react";
import styles from "~/styles/Global.css";
import { AudioRecorder } from "~/components/AudioRecorder"; 
import { createClient } from "@deepgram/sdk";


export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

// Import the createClient function only on the server side
let deepgramClient: any;
if (typeof window === 'undefined') {
  deepgramClient = createClient(process.env.DEEPGRAM_API_KEY as string);
}

// Define the shape of the action response
type ActionData = {
  transcript?: string;
  error?: string;
};

// Export the action function
export const action = async ({ request }: ActionFunctionArgs): Promise<ReturnType<typeof json<ActionData>>> => {
  console.log('action')
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return json<ActionData>({ error: 'No audio file provided' }, { status: 400 });
  }
  console.log('Audio file received:', audioFile.name, audioFile.type, audioFile.size);

  try {
    console.log('Calling Deepgram API');
    const response = await deepgramClient.listen.prerecorded.transcribeFile(audioFile, {
      smart_format: true,
      model: 'general',
    });
    console.log('Deepgram API response:', JSON.stringify(response, null, 2));
    const transcript = response.result.results.channels[0].alternatives[0].transcript;
    console.log('Transcription result:', transcript);
	  console.log('success')
    if (!transcript) {
      console.log('Transcript is undefined');
      return json<ActionData>({ error: 'Transcription failed - no transcript returned' }, { status: 500 });
    }
	  return json<ActionData>({ transcript });    
  } catch (error) {
    console.error('Transcription error:', error);
    console.log('fail')
    return json<ActionData>({ error: 'Transcription failed' }, { status: 500 });
  }
};

export default function Test() {
  return (
    <div>
      <h1>Dementia Detection Test</h1>
      {/* Add your test content here */}
      <Image
        width={500}
        alt="Cookie Theft Test"
        src="https://res.cloudinary.com/dxewrioco/image/upload/v1720200161/cookie_uexxc3.png"
        className="mb-4"
      />
      <h3> Instructions: </h3>
      <p> Describe everything you see in the image in an audio recording.</p>
      <p> Click on the 'RECORD' button below to begin recording </p>
      <p> When done, click the 'SUBMIT' button below</p>

      {/* <Button
        as={Link}
        to=""
        color="primary"
        size="lg"
        className="record-btn"
      >
        Record
      </Button> */}
      <AudioRecorder />
    </div>
  );
}