import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setPageNumber(1); // Reset to first page on new document load
    setLoadError(null); // Clear previous errors
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setLoadError(`Failed to load PDF file. ${error.message}`);
    setNumPages(null); // Reset pages info on error
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    if (pageNumber > 1) {
      changePage(-1);
    }
  }

  function nextPage() {
    if (pageNumber < numPages) {
      changePage(1);
    }
  }

  if (!fileUrl) {
    return <div className="no-pdf-message">Please provide a PDF file URL.</div>;
  }

  return (
    <div className="pdf-viewer-container">
      {loadError && <div className="error-message">{loadError}</div>}
      {numPages && (
        <div className="controls">
          <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button type="button" disabled={pageNumber >= numPages} onClick={nextPage}>
            Next
          </button>
        </div>
      )}
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="loading-message">Loading PDF…</div>}
        error={<div className="error-message">Error loading document. Check console.</div>}
      >
        {/* Only render the Page component if numPages is known */}
        {numPages && (
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true} // Enable text selection
            renderAnnotationLayer={true} // Enable annotations (like links)
          />
        )}
      </Document>
       {/* Optional: Render all pages (can be slow for large PDFs) */}
       {/* {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))} */}
    </div>
  );
}

export default PdfViewer;
