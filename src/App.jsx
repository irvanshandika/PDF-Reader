import React, { useState, useRef, useEffect } from 'react';
import PdfViewer from './PdfViewer';
import './index.css';

function App() {
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleUrlChange = (event) => {
    setInputUrl(event.target.value);
    setError('');
  };

  const handleLoadFromUrl = () => {
    if (!inputUrl) {
      setError('Please enter a URL');
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPdfFileUrl(inputUrl);
    setError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setError('');

    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const newObjectUrl = URL.createObjectURL(file);
      objectUrlRef.current = newObjectUrl;
      setPdfFileUrl(newObjectUrl);
      setInputUrl('');
    }
  };

  const handleClear = () => {
    setPdfFileUrl(null);
    setInputUrl('');
    setError('');
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h1>PDF Viewer</h1>
      
      <div className="controls-container">
        <div className="control-group">
          <label htmlFor="pdf-url-input">PDF URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="pdf-url-input"
              type="text"
              value={inputUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/document.pdf"
              disabled={!!pdfFileUrl && pdfFileUrl === objectUrlRef.current}
            />
            <button 
              onClick={handleLoadFromUrl} 
              disabled={!inputUrl || (!!pdfFileUrl && pdfFileUrl === objectUrlRef.current)}
            >
              Load
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="pdf-file-input">Or upload a file</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={!!pdfFileUrl && pdfFileUrl !== objectUrlRef.current}
            />
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={handleClear} 
            disabled={!pdfFileUrl}
            style={{ background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)' }}
          >
            Clear
          </button>
        </div>
      </div>

      <PdfViewer fileUrl={pdfFileUrl} />
    </div>
  );
}

export default App;
