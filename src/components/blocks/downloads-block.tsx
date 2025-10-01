import { DownloadsBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, File, FileImage } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function DownloadsBlock({
  title,
  subtitle,
  categories,
  layout = 'grid',
}: DownloadsBlockProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <FileImage className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getFileSize = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  if (layout === 'list') {
    return (
      <div className="px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="space-y-8">
            {categories.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <div className="space-y-2">
                  {category.files.map((file, fileIndex) => (
                    <Card key={fileIndex} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{file.name}</h4>
                            {file.description && (
                              <p className="text-xs text-muted-foreground truncate">{file.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {file.sizeKB && (
                            <span className="text-xs text-muted-foreground">
                              {getFileSize(file.sizeKB)}
                            </span>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <a href={file.url} download>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="space-y-10">
          {categories.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.files.map((file, fileIndex) => (
                  <Card key={fileIndex} className="p-6 hover:shadow-lg transition-all hover:scale-105">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{file.name}</h4>
                        {file.sizeKB && (
                          <Badge variant="secondary" className="text-xs">
                            {getFileSize(file.sizeKB)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {file.description && (
                      <p className="text-xs text-muted-foreground mb-4">{file.description}</p>
                    )}

                    <Button size="sm" className="w-full" asChild>
                      <a href={file.url} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

registerBlock({
  type: 'downloads',
  name: 'Downloads & Resources',
  description: 'Downloadable files and documents',
  component: DownloadsBlock,
  defaultProps: {
    title: 'Downloads & Resources',
    subtitle: 'Forms, policies, and important documents',
    categories: [
      {
        name: 'Forms & Applications',
        files: [
          {
            name: 'Admission Application Form',
            description: 'New student enrollment form',
            type: 'pdf',
            url: '/downloads/admission-form.pdf',
            sizeKB: 245,
          },
          {
            name: 'Medical Consent Form',
            description: 'Required for all students',
            type: 'pdf',
            url: '/downloads/medical-form.pdf',
            sizeKB: 180,
          },
        ],
      },
      {
        name: 'School Policies',
        files: [
          {
            name: 'Student Handbook 2025',
            description: 'Rules and regulations',
            type: 'pdf',
            url: '/downloads/handbook.pdf',
            sizeKB: 1024,
          },
          {
            name: 'Anti-Bullying Policy',
            description: 'School commitment to student safety',
            type: 'pdf',
            url: '/downloads/anti-bullying.pdf',
            sizeKB: 156,
          },
        ],
      },
    ],
    layout: 'grid',
  },
  icon: 'download',
  category: 'content',
});

