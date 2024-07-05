import { useState, useEffect } from 'react';
import { useFetcher, Link } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import styles from '../styles/Global.css';

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface ModelProps {
  transcript: string;
}

export function Model({ transcript }: ModelProps) {
  const fetcher = useFetcher()
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [showButton, setShowButton] = useState(true);



  const sendToModel = async () => {
    const formData = new FormData();
    formData.append('transcript', transcript);
    fetcher.submit(formData, { method: 'post', action: '/diagnosis' });
    console.log(formData);
    setShowButton(false);  // Hide the button after clicking

  };
  // useEffect(() => {
  //   if (transcript) {
  //     sendToModel();
  //   }
  // }, [transcript]);

  useEffect(() => {
    if (fetcher.data?.result) {
      console.log(fetcher.data.result[0]);
      setResult(fetcher.data.result);
      setConfidence(fetcher.data.confidence*100);
    }
  }, [fetcher.data]);

  return (
    <div>
      {showButton && (
        <Button onClick={sendToModel}>Get results!</Button>
      )}      
      {result && (
        <p>
          Result: {result}
        </p>
      )}
      {confidence && (
      <p>
        with {Number(parseFloat(confidence).toFixed(2))}% Confidence
      </p>
)}      {fetcher.state === 'submitting' && <p>Loading...</p>}
      {fetcher.data?.error && <p>Error: {fetcher.data.error}</p>}
      <p className='line'> --- </p>
      {!showButton && (
        <Button
        as={Link}
        to="/"
        color="primary"
        className="btn"
      >
        Take test again
      </Button>
      )}  
      
  </div>
  )
};
