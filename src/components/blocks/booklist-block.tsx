import { BooklistBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Printer, Download } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function BooklistBlock({
  title,
  year,
  books,
  showPrices = true,
  showISBN = true,
  includeOptional = true,
}: BooklistBlockProps) {
  const requiredBooks = books.filter(book => book.required);
  const optionalBooks = books.filter(book => !book.required);

  const calculateTotal = () => {
    return books
      .filter(book => book.required || (includeOptional && !book.required))
      .reduce((sum, book) => sum + (book.price || 0), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Use browser's print to PDF functionality
    window.print();
  };

  return (
    <div className="px-6 py-12 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header - hidden in print */}
        <div className="mb-8 print:mb-4">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-lg text-muted-foreground mb-4">{year}</p>
          
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>

        {/* Print header - only visible in print */}
        <div className="hidden print:block mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-lg">{year}</p>
          <p className="text-sm text-gray-600 mt-2">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Required Books */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Required Books
          </h3>
          
          <div className="space-y-3">
            {requiredBooks.map((book, index) => (
              <Card key={index} className="p-4 print:shadow-none print:border print:border-gray-300">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    {book.edition && (
                      <p className="text-sm text-muted-foreground">{book.edition}</p>
                    )}
                    {showISBN && book.isbn && (
                      <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn}</p>
                    )}
                    {book.notes && (
                      <p className="text-sm mt-2 text-muted-foreground italic">{book.notes}</p>
                    )}
                  </div>
                  {showPrices && book.price && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
                      {book.supplier && (
                        <p className="text-xs text-muted-foreground">{book.supplier}</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Optional Books */}
        {includeOptional && optionalBooks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Optional/Recommended Books
            </h3>
            
            <div className="space-y-3">
              {optionalBooks.map((book, index) => (
                <Card key={index} className="p-4 bg-muted/50 print:bg-gray-50 print:shadow-none print:border print:border-gray-300">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      {book.edition && (
                        <p className="text-sm text-muted-foreground">{book.edition}</p>
                      )}
                      {showISBN && book.isbn && (
                        <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn}</p>
                      )}
                      {book.notes && (
                        <p className="text-sm mt-2 text-muted-foreground italic">{book.notes}</p>
                      )}
                    </div>
                    {showPrices && book.price && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
                        {book.supplier && (
                          <p className="text-xs text-muted-foreground">{book.supplier}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Total - only show if prices are enabled */}
        {showPrices && (
          <Card className="p-6 bg-primary/5 print:bg-gray-100 print:border-2 print:border-black">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Estimated Total</p>
                <p className="text-sm text-muted-foreground">
                  {includeOptional ? 'Includes optional books' : 'Required books only'}
                </p>
              </div>
              <p className="text-3xl font-bold">${calculateTotal().toFixed(2)}</p>
            </div>
          </Card>
        )}

        {/* Print footer */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600">
          <p>Please check with your school for the most up-to-date booklist.</p>
          <p>Prices are approximate and may vary by supplier.</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'booklist',
  name: 'Booklist',
  description: 'School booklist with print support',
  component: BooklistBlock,
  defaultProps: {
    title: 'School Booklist',
    year: '2025',
    books: [
      {
        title: 'Introduction to Mathematics',
        author: 'John Smith',
        edition: '5th Edition',
        isbn: '978-1234567890',
        price: 89.95,
        supplier: 'Academic Books',
        required: true,
        notes: 'Essential for Year 9 Mathematics',
      },
      {
        title: 'English Literature Anthology',
        author: 'Jane Doe',
        edition: '3rd Edition',
        isbn: '978-0987654321',
        price: 65.50,
        supplier: 'Book Depot',
        required: true,
      },
      {
        title: 'Advanced Science Reader',
        author: 'Dr. Sarah Johnson',
        edition: '2nd Edition',
        isbn: '978-1122334455',
        price: 45.00,
        supplier: 'Science Books Plus',
        required: false,
        notes: 'Recommended for advanced students',
      },
    ],
    showPrices: true,
    showISBN: true,
    includeOptional: true,
  },
  icon: 'book',
  category: 'content',
});

