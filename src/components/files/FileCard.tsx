
"use client";

import { UserFile } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileIcon } from './FileIcon';
import { Download, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileCardProps {
  file: UserFile;
  onDelete: (id: string) => void;
  onDownload: (file: UserFile) => void;
}

export function FileCard({ file, onDelete, onDownload }: FileCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md border-muted/60 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-4 flex flex-col items-center justify-center aspect-[4/3] bg-muted/20 relative">
        <FileIcon type={file.type} className="w-16 h-16 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
        <div className="text-xs text-muted-foreground absolute bottom-2 right-2">
          {file.extension.toUpperCase()}
        </div>
        {file.summary && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-center justify-center text-center text-xs text-white">
            <p className="line-clamp-4">{file.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start gap-2 bg-white">
        <div className="flex justify-between items-start w-full gap-2">
          <h3 className="font-medium text-sm truncate flex-1" title={file.name}>
            {file.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(file.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
          <span>{formatSize(file.size)}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(file.createdAt))} ago</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {file.categories.slice(0, 1).map(cat => (
            <Badge key={cat} variant="secondary" className="text-[10px] h-4 bg-secondary/10 text-secondary hover:bg-secondary/20">
              {cat}
            </Badge>
          ))}
          {file.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1.5 border-primary/20 text-primary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
