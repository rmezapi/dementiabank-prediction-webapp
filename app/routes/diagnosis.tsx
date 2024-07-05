import { useLocation } from '@remix-run/react';
import fetch from 'node-fetch';
import { Model } from '../components/Model';
import { ActionFunctionArgs, json } from '@remix-run/node';
import 'app/styles/Global.css';


export function links() {
  return [{ rel: "stylesheet", href: "app/styles/Global.css"  }];
}

// fetchWithRetry is a function that fetches data from the HuggingFace API with 3 retries
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status !== 503) throw new Error(`HTTP error! status: ${response.status}`);
      console.log(`Attempt ${i + 1} failed, retrying...`);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000));
    }
  }
  throw new Error('Max retries reached');
}

// action is a function that handles the form submission and sends the transcription data to the HuggingFace API
// called from the SubmitRecordingButton
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const transcript = formData.get('transcript');

  if (!transcript) {
    return json({ error: 'No transcript provided' }, { status: 400 });
  }

  try {
    console.log("Calling HuggingFace API...");
    console.log("transcript: ", transcript);
    
    const response = await fetchWithRetry(
      'https://api-inference.huggingface.co/models/rmezapi/dementia-bank-seq-classif-xlnet',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: transcript })
      }
    );

    const data: any = await response.json();
    console.log('data: ', data[0][0]);
    if (data[0][0]['label'] === 'LABEL_1') {
      return json({ result: 'Dementia', confidence: data[0][0]['score'] });
    } else {
      return json({ result: 'No Dementia', confidence: data[0][0]['score'] });
    }
  } catch (error: any) {
    console.error('Error fetching result:', error.message);
    return json({ error: 'Service temporarily unavailable. Please try again later.' }, { status: 503 });
  }
};


export default function Diagnosis() {
    // these allow us to get transcription data from the URL state, sent from the SubmitRecordingButton
    const location = useLocation();
    const text = location.state?.transcript;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Test Results</h1>
      
      {/* model component render with transcription data as param */}
      <Model transcript={text} />
    </div>
  );
}

