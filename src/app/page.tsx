
"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { FileCard } from '@/components/files/FileCard';
import { FileUpload } from '@/components/files/FileUpload';
import { UserFile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, FolderOpen, LayoutGrid, List, Filter, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const MOCK_FILES: UserFile[] = [
  {
    id: '1',
    name: 'Project_Proposal.pdf',
    size: 2400000,
    type: 'application/pdf',
    extension: 'pdf',
    url: '#',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: 'demo',
    tags: ['proposal', 'work'],
    categories: ['Documents'],
    summary: 'A comprehensive proposal for the upcoming Q3 marketing campaign and budget allocation.'
  },
  {
    id: '2',
    name: 'Client_Assets.zip',
    size: 15400000,
    type: 'application/zip',
    extension: 'zip',
    url: '#',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: 'demo',
    tags: ['clients', 'assets'],
    categories: ['Other'],
  },
  {
    id: '3',
    name: 'Banner_Draft_V2.png',
    size: 1200000,
    type: 'image/png',
    extension: 'png',
    url: 'https://picsum.photos/seed/file1/800/600',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    userId: 'demo',
    tags: ['design', 'marketing'],
    categories: ['Images'],
    summary: 'The second draft of the website banner incorporating the new brand colors.'
  }
];

export default function ArchiveFlowDashboard() {
  const [files, setFiles] = useState<UserFile[]>(MOCK_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          file.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && file.categories.includes(filterType);
  });

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = (newFile: UserFile) => {
    setFiles(prev => [newFile, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Upload Section */}
          <div className="lg:col-span-3 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Upload File
              </h2>
              <FileUpload onUploadComplete={handleUpload} />
            </section>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-muted/60">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
              <nav className="space-y-1">
                {['all', 'Documents', 'Images', 'Code', 'Marketing', 'Finance'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterType(cat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filterType === cat 
                        ? 'bg-primary text-white font-medium' 
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    {cat === 'all' ? 'All Files' : cat}
                  </button>
                ))}
              </nav>
            </section>

            <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Secure Storage</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All files are encrypted at rest and only accessible by you.
              </p>
            </div>
          </div>

          {/* Main Content / File Listing */}
          <div className="lg:col-span-9">
            <div className="flex flex-col gap-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-muted/60">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by filename or tags..." 
                    className="pl-10 h-10 bg-muted/20 border-transparent focus:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                    <TabsList className="h-10 bg-muted/40">
                      <TabsTrigger value="grid" className="h-8"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="list" className="h-8"><List className="h-4 w-4" /></TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button variant="outline" size="icon" className="h-10 w-10 border-muted">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File Display */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">
                    {filterType === 'all' ? 'Your Files' : filterType}
                    <span className="ml-3 text-sm font-normal text-muted-foreground">
                      {filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''}
                    </span>
                  </h1>
                </div>

                {filteredFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-muted-foreground/20">
                    <div className="bg-muted p-6 rounded-full mb-4">
                      <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">No files found</h3>
                    <p className="text-muted-foreground max-w-sm">
                      We couldn't find any files matching your current search or category filter.
                    </p>
                    <Button 
                      variant="link" 
                      onClick={() => {setSearchQuery(''); setFilterType('all');}}
                      className="mt-2 text-primary"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFiles.map(file => (
                      <FileCard 
                        key={file.id} 
                        file={file} 
                        onDelete={handleDelete}
                        onDownload={(f) => toast({ title: "Downloading", description: `Starting download for ${f.name}` })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-muted/60 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-b text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Name</th>
                          <th className="px-6 py-4 font-semibold">Tags</th>
                          <th className="px-6 py-4 font-semibold">Size</th>
                          <th className="px-6 py-4 font-semibold">Added</th>
                          <th className="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredFiles.map(file => (
                          <tr key={file.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <FileIcon type={file.type} className="h-5 w-5" />
                                <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1">
                                {file.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[10px] py-0">#{tag}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(file.createdAt))} ago
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(file.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary font-bold text-xl">
            <Zap className="h-6 w-6 fill-primary" />
            ArchiveFlow
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 ArchiveFlow. Secure, intelligent file storage for modern teams.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Minimal Trash2 import fix
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
