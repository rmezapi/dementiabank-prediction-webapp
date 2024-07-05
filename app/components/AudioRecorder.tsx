import { Button } from '@nextui-org/react';
import { useState, useEffect, useRef } from 'react';
import { SubmitRecordingButton } from './SubmitRecordingButton';

export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API or getUserMedia not supported.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setRecordingStatus('Recording stopped');
        audioChunksRef.current = []; // Reset the chunks array
      };

      recorder.start();
      setIsRecording(true);
      setRecordingStatus('Recording...');
      console.log('started recording');
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingStatus('Processing recording...');
      console.log('stopped recording');

      // Stop all tracks to release the microphone
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  return (
    <div>
      <div className='buttons'>
        <h5 className='recording-status'>{recordingStatus}</h5>
        {!isRecording && <Button className="record-btn" onClick={startRecording} disabled={isRecording}>Start Recording</Button>}
        {isRecording && <Button className="stop-btn" onClick={stopRecording} disabled={!isRecording}>Stop Recording</Button>}
      </div>
      <div className='audio'>
        {audioUrl && <audio ref={audioRef} controls src={audioUrl} />}
      </div>
      <div className='submit'>
        {recordingStatus === 'Recording stopped' && audioBlob && (
          <>
            <SubmitRecordingButton audioBlob={audioBlob} />
          </>
        )}
      </div>
    </div>
  );
};
