import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import ConfettiExplosion from 'react-confetti-explosion';

// props for the model component 
interface ModelProps {
  transcript: string;
}

export function Model({ transcript }: ModelProps) {
  // fetcher and navigate are remix hooks to handle the form submission and navigation
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [showButton, setShowButton] = useState(true);

  // handleNavigateToHome is a function that navigates to the home page when called
  const handleNavigateToHome = () => {
    console.log('Navigating to home');
    window.location.href = '/';
  };

  // sendToModel is a function that sends the transcription data to the HuggingFace API
  const sendToModel = async () => {
    const formData = new FormData();
    formData.append('transcript', transcript);
    fetcher.submit(formData, { method: 'post', action: '/diagnosis' });
    console.log(formData);
    setShowButton(false);  // Hide the button after clicking
  };

  // useEffect is a hook that runs when the fetcher data changes
  useEffect(() => {
    if (fetcher.data?.result) {
      console.log(fetcher.data.result[0]);
      setResult(fetcher.data.result);
      setConfidence(fetcher.data.confidence * 100);
    }
  }, [fetcher.data]);

  return (
    <div className="min-h-dvh">
      {/* show textand  transcript when there is a transcript */}
      {transcript && <h5>You said:</h5> && <p className="text-2xl">"{transcript}"</p>}
      {/* show button to take test to see results when there is no transcript */}
      {!transcript && <Button onClick={handleNavigateToHome} color="primary" className="btn"> Take test to see results! </Button>}
      {/* show button to get test results when there is a transcript and the button is shown */}
      {showButton && transcript && (
        <Button className="submit-btn" onClick={sendToModel}>Get test results!</Button>
      )}
      {result == "No Dementia" && <ConfettiExplosion />}
      {/* show the result and confidence when there is a result */}
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
      {/* show loading message when the fetcher is submitting */}
      {fetcher.state === 'submitting' && <p>Loading...</p>}
      {/* show error message when there is an error */}
      {fetcher.data?.error && <p>Error: {fetcher.data.error}</p> && <p> I'm having trouble connecting to the model, please try again! </p>}
      <p className='line'>---</p>
      {/* show button to take test again when the button is shown */}
      {!showButton && (
        <Button
          onClick={handleNavigateToHome}
          color="primary"
          className="submit-btn"
        >
          Take test again
        </Button>
      )}
    </div>
  );
}
