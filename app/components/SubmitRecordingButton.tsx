import { Button } from "@nextui-org/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

// props for the submit recording button
interface SubmitRecordingButtonProps {
  audioBlob: Blob;
}

export const SubmitRecordingButton = ({ audioBlob }: SubmitRecordingButtonProps) => {
  // fetcher and navigate are remix hooks to handle the form submission and navigation
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // sends the audio blob to the server to be transcribed
  const handleTranscribe = async () => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    fetcher.submit(formData, { method: 'post', encType: 'multipart/form-data', action: '/test' });
  };

  // logs transcription data and navigates to the diagnosis page
  useEffect(() => {
    console.log('Fetcher state:', fetcher.state);
    console.log('Fetcher data:', fetcher.data);
    if (fetcher.data?.transcript) {
      console.log('Transcription:', fetcher.data.transcript);
      // Navigate to diagnosis page with transcript data
      navigate('/diagnosis', { state: { transcript: fetcher.data.transcript } });
    }
  }, [fetcher.data, navigate]);

  return (
    <div className="min-h-dvh">
      {/* displays error message if there is an error */}
      {fetcher.data?.error && <p className="error-message">Error: {fetcher.data.error} please try again</p>}
      
      {/* submit button */}
      <Button
        className="submit-btn"
        onClick={() => {
          handleTranscribe();
        }}
        color="primary"
        size="lg"
        disabled={fetcher.state === 'submitting'}
      >
        {/* submit button text changes when the fetcher state is submitting */}
        {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  );
};