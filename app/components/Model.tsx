import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import 'app/styles/Global.css';

export function links() {
  return [{ rel: "stylesheet", href: "/app/styles/Global.css" }];
}

interface ModelProps {
  transcript: string;
}

export function Model({ transcript }: ModelProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [showButton, setShowButton] = useState(true);

  const handleNavigateToHome = () => {
    console.log('Navigating to home');
    window.location.href = '/';
  };

  const sendToModel = async () => {
    const formData = new FormData();
    formData.append('transcript', transcript);
    fetcher.submit(formData, { method: 'post', action: '/diagnosis' });
    console.log(formData);
    setShowButton(false);  // Hide the button after clicking
  };

  useEffect(() => {
    if (fetcher.data?.result) {
      console.log(fetcher.data.result[0]);
      setResult(fetcher.data.result);
      setConfidence(fetcher.data.confidence * 100);
    }
  }, [fetcher.data]);

  return (
    <div>
      {transcript && <h5>You said:</h5> && <p className="text-2xl">"{transcript}"</p>}
      {!transcript && <Button onClick={handleNavigateToHome} color="primary" className="btn"> Take test to see results! </Button>}
      {showButton && transcript && (
        <Button className="btn" onClick={sendToModel}>Get test results!</Button>
      )}
      {result && (
        <div>
          <h5>Your diagnosis:</h5>
          <p>{result}</p>
        </div>
      )}
      {confidence && (
        <p>
          with {Number(parseFloat(confidence).toFixed(2))}% Confidence
        </p>
      )}
      {fetcher.state === 'submitting' && <p>Loading...</p>}
      {fetcher.data?.error && <p>Error: {fetcher.data.error}</p>}
      <p className='line'>---</p>
      {!showButton && (
        <Button
          onClick={handleNavigateToHome}
          color="primary"
          className="btn"
        >
          Take test again
        </Button>
      )}
    </div>
  );
}
