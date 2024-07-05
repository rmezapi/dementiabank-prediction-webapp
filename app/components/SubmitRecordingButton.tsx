import { Button } from "@nextui-org/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import styles from '../styles/Global.css';

interface SubmitRecordingButtonProps {
  audioBlob: Blob;
}

export const SubmitRecordingButton = ({ audioBlob }: SubmitRecordingButtonProps) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleTranscribe = async () => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    fetcher.submit(formData, { method: 'post', encType: 'multipart/form-data', action: '/test' });
  };

  useEffect(() => {
    console.log('Fetcher state:', fetcher.state);
    console.log('Fetcher data:', fetcher.data);
    if (fetcher.data?.transcript) {
      console.log('Transcription result:', fetcher.data.transcript);
      // Navigate to diagnosis page with transcript data
      navigate('/diagnosis', { state: { transcript: fetcher.data.transcript } });
    }
  }, [fetcher.data, navigate]);

  return (
    <>
      <Button
        onClick={() => {
          console.log('submit');
          handleTranscribe();
        }}
        color="primary"
        size="lg"
        className="btn"
        disabled={fetcher.state === 'submitting'}
      >
        {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit'}
      </Button>
      {fetcher.data?.transcript && (
        <div>
          <h3>Transcription:</h3>
          <p>{fetcher.data.transcript}</p>
        </div>
      )} 
      {fetcher.data?.error && <p>Error: {fetcher.data.error}</p>}
    </>
  );
};