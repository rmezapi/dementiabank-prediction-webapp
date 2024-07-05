import { ActionFunctionArgs, json } from '@remix-run/node';
import { 
  Button, 
  Image } from "@nextui-org/react";
import '/styles/Global.css';
import { AudioRecorder } from "~/components/AudioRecorder"; 
import { createClient } from "@deepgram/sdk";


export function links() {
  return [{ rel: "stylesheet", href: "/styles/Global.css" }];
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
  console.log('In test action fn...')
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
    if (!transcript) {
      console.log('Transcript is undefined');
      return json<ActionData>({ error: 'Transcription failed - no transcript returned' }, { status: 500 });
    }
	  return json<ActionData>({ transcript: transcript });    
  } catch (error) {
    console.error('Transcription error:', error);
    return json<ActionData>({ error: 'Transcription failed' }, { status: 500 });
  }
};

export default function Test() {
  return (
    <div className="min-h-dvh">
      <h1 className="title">Dementia Detection Test</h1>
      <Image
        className="image"
        alt="Cookie Theft Test"
        src="https://res.cloudinary.com/dxewrioco/image/upload/v1720200161/cookie_uexxc3.png"
        
      />
      <h3> Instructions: </h3>
      <p> Describe everything you see in the image in detail an audio recording.</p> 
      <p>When done, click the 'SUBMIT' button below</p>

      {/* audio recorder component to record and handle all the audio recording logic */}
      <AudioRecorder />
    </div>
  );
}