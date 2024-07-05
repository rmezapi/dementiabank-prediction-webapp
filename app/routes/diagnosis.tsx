import { useLocation } from '@remix-run/react';
import fetch from 'node-fetch';
import { Model } from '../components/Model';
import { ActionFunctionArgs, json } from '@remix-run/node';
import styles from '../styles/Global.css';


export function links() {
  return [{ rel: "stylesheet", href: styles }];
}


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const transcript = formData.get('transcript');

  if (!transcript) {
    return json({ error: 'No transcript provided' }, { status: 400 });
  }

  try {
    console.log("Calling HuggingFace API...")
    console.log("transcript: ", transcript)
    const response = await fetch('https://api-inference.huggingface.co/models/rmezapi/dementia-bank-seq-classif-xlnet', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: transcript })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();
    console.log('data: ', data[0][0]);
    if (data[0][0]['label'] === 'LABEL_1') {
      return json({ result: 'Dementia', confidence: data[0][0]['score'] });
    } else {
      return json({ result: 'No Dementia', confidence: data[0][0]['score'] });
    }
  } catch (error: any) {
    console.error('Error fetching result:', error.message);
    return json({ error: 'Error fetching result' }, { status: 500 });
  }
};


export default function Diagnosis() {
    const location = useLocation();
    const text = location.state?.transcript;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Test Results</h1>
      <h2>  You said: </h2>
      <p className="text-2xl"> {text} </p>
      <h2> Your diagnosis: </h2>

      <Model transcript={text} />
    </div>
  );
}

