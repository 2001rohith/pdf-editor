import React, { useState, useRef, useEffect } from 'react';

interface PDFPageSelectorProps {
  file: File;
}

const PDFPageSelector: React.FC<PDFPageSelectorProps> = ({ file }) => {
  const [pages, setPages] = useState<number[]>([]);
  const [selectedPages, setSelectedPages] = useState<boolean[]>([]);
  const pdfViewerRef = useRef<HTMLVideoElement>(null);

  const fileUrl = URL.createObjectURL(file);

  useEffect(() => {
    const loadPdf = () => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.src = fileUrl;
        
        pdfViewerRef.current.onloadedmetadata = () => {
          const estimatedPages = Math.max(1, Math.ceil(
            (pdfViewerRef.current?.duration || 1)
          ));
          
          const pageArray = Array.from({ length: estimatedPages }, (_, i) => i + 1);
          setPages(pageArray);
          setSelectedPages(new Array(pageArray.length).fill(false));
        };
      }
    };

    loadPdf();

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  const togglePageSelection = (index: number) => {
    const newSelectedPages = [...selectedPages];
    newSelectedPages[index] = !newSelectedPages[index];
    setSelectedPages(newSelectedPages);
  };

  const extractSelectedPages = () => {
    const selectedPageIndices = selectedPages
      .map((selected, index) => selected ? index : -1)
      .filter(index => index !== -1);

    console.log('Selected pages:', selectedPageIndices);
    alert(`Selected pages: ${selectedPageIndices.join(', ')}`);
  };

  return (
    <div className="container">
      <video 
        ref={pdfViewerRef} 
        src={fileUrl} 
        className="d-none" 
        controls 
      />

      <div className="row g-3">
        {pages.map((pageNum, index) => (
          <div key={pageNum} className="col-6 col-md-4 col-lg-3">
            <div className="card position-relative">
              <div className="bg-light d-flex justify-content-center align-items-center" style={{height: '200px'}}>
                Page {pageNum}
              </div>
              <div className="position-absolute top-2 end-2">
                <input 
                  type="checkbox"
                  checked={selectedPages[index] || false}
                  onChange={() => togglePageSelection(index)}
                  className="form-check-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <button 
          onClick={extractSelectedPages}
          disabled={!selectedPages.some(Boolean)}
          className="btn btn-primary w-100"
        >
          Extract Selected Pages
        </button>
      </div>
    </div>
  );
};

export default PDFPageSelector;