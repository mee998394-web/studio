
"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react';
import { autoExpressFile, AutoExpressOutput } from '@/ai/flows/auto-express-flow';
import { UserFile } from '@/lib/types';

interface ExpressDialogProps {
  file: UserFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpressDialog({ file, isOpen, onClose }: ExpressDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AutoExpressOutput | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && file) {
      handleExpress();
    } else {
      setResult(null);
      setIsPlaying(false);
    }
  }, [isOpen, file]);

  const handleExpress = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      // For images, we could pass the URL if it's a data URI or accessible.
      // For this demo, we assume text or metadata.
      const res = await autoExpressFile({
        fileName: file.name,
        fileMimeType: file.type,
        // In a real app, you'd fetch content for non-summarized files here
        fileContent: file.summary || "", 
      });
      setResult(res);
    } catch (error) {
      console.error("Auto-Express failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Auto-Express
          </DialogTitle>
          <DialogDescription>
            AI-powered instant file insight and audio overview.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse font-medium">Generating AI Expression...</p>
            </div>
          ) : result ? (
            <div className="w-full space-y-6">
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
                <p className="text-foreground leading-relaxed text-center italic text-lg">
                  "{result.summary}"
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <audio 
                  ref={audioRef} 
                  src={result.audioDataUri} 
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <Button 
                  size="lg" 
                  onClick={togglePlayback}
                  className="rounded-full w-20 h-20 shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <VolumeX className="h-8 w-8" />
                  ) : (
                    <Volume2 className="h-8 w-8" />
                  )}
                </Button>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  {isPlaying ? "Playing Overview" : "Listen to Overview"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to express this file. Please try again.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center pb-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
