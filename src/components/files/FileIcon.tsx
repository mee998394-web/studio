
import { 
  FileText, 
  Image as ImageIcon, 
  File as FileIconBase, 
  FileCode, 
  Film, 
  Music, 
  Type 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileIconProps {
  type: string;
  className?: string;
}

export function FileIcon({ type, className }: FileIconProps) {
  const t = type.toLowerCase();
  
  if (t.includes('pdf')) return <FileText className={cn("text-red-500", className)} />;
  if (t.includes('image')) return <ImageIcon className={cn("text-blue-500", className)} />;
  if (t.includes('text')) return <Type className={cn("text-gray-500", className)} />;
  if (t.includes('video')) return <Film className={cn("text-purple-500", className)} />;
  if (t.includes('audio')) return <Music className={cn("text-green-500", className)} />;
  if (t.includes('javascript') || t.includes('json') || t.includes('code')) return <FileCode className={cn("text-yellow-600", className)} />;
  
  return <FileIconBase className={cn("text-muted-foreground", className)} />;
}
