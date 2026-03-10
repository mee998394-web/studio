
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';
import { intelligentFileTagging } from '@/ai/flows/intelligent-file-tagging';
import { useToast } from '@/hooks/use-toast';
import { UserFile } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onUploadComplete: (file: UserFile) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(10);

      // Simulate Upload Process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real app, you'd upload to Firebase Storage here
      // For this prototype, we'll read text files for content-based tagging
      let content = '';
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        content = await file.text();
      }

      setProgress(100);
      setIsUploading(false);
      setIsAnalyzing(true);

      // AI Analysis
      const aiResult = await intelligentFileTagging({
        fileName: file.name,
        fileContent: content.slice(0, 2000), // Limit content for API
        fileMimeType: file.type
      });

      const newFile: UserFile = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: file.type,
        extension: file.name.split('.').pop() || '',
        url: URL.createObjectURL(file), // Mock URL
        createdAt: new Date().toISOString(),
        userId: 'demo-user',
        tags: aiResult.suggestedTags,
        categories: aiResult.suggestedCategories,
        summary: aiResult.summary,
      };

      onUploadComplete(newFile);
      toast({
        title: "File Uploaded Successfully",
        description: `ArchiveFlow AI tagged your file with: ${aiResult.suggestedTags.slice(0, 2).join(', ')}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error processing your file."
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col gap-4">
        {isUploading || isAnalyzing ? (
          <div className="p-8 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-primary">Uploading your file...</h3>
                <div className="w-full max-w-xs mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
              </>
            ) : (
              <>
                <Sparkles className="h-10 w-10 text-secondary animate-pulse mb-4" />
                <h3 className="text-lg font-semibold text-secondary">Analyzing with AI...</h3>
                <p className="text-sm text-muted-foreground mt-2">Generating intelligent tags and summaries</p>
              </>
            )}
          </div>
        ) : (
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 flex flex-col gap-2 rounded-xl"
            variant="ghost"
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">Click or drag to upload</span>
              <span className="text-xs text-muted-foreground">PDF, Images, Documents up to 50MB</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
