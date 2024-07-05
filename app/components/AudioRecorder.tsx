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

  // startRecording is a function that starts the recording process, accessing the mic only when the user clicks the start recording button
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API or getUserMedia not supported.');
      return;
    }
    // try to access the microphone on button click
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

  // stopRecording is a function that stops the recording process, stopping the mic and releasing the microphone
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
        {/* recording status to let the user know whether the mic is recording or not */}
        <h5 className='recording-status'>{recordingStatus}</h5>
        {/* start recording button when state is not recording */}
        {!isRecording && <Button className="record-btn" onClick={startRecording} disabled={isRecording}>Start Recording</Button>}
        {/* stop recording button when state is recording */}
        {isRecording && <Button className="stop-btn" onClick={stopRecording} disabled={!isRecording}>Stop Recording</Button>}
      </div>
      <div className='audio'>
        {/* audio player when audio url is not null, meaning there is a recording */}
        {audioUrl && <audio ref={audioRef} controls src={audioUrl} />}
      </div>
      {/* submit button when recording status is recording stopped and audio blob is not null */}
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
