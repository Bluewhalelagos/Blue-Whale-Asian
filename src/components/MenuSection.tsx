import React, { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const MenuSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const bookRef = useRef(null);
  const adobeEmbedApiKey = '6e314bf5008143759eaaec590c411470';
  const pdfUrl = '../Fancy Restaurant Menu1.pdf'; // Replace with actual file path

  useEffect(() => {
    if (isOpen) {
      // Load the Adobe PDF Embed API
      const script = document.createElement('script');
      script.src = 'https://documentcloud.adobe.com/view-sdk/main.js';
      script.async = true;
      script.onload = () => {
        // Initialize the PDF Embed API
        window.adobeDCView = new window.AdobeDC.View({
          clientId: adobeEmbedApiKey,
          divId: 'adobe-dc-view'
        });
        window.adobeDCView.previewFile({
          content: { location: pdfUrl },
          metaData: { fileName: 'Fancy Restaurant Menu.pdf' }
        }, {});
      };
      document.body.appendChild(script);
    }
  }, [isOpen, pdfUrl, adobeEmbedApiKey]);

  const handleClick = () => {
    if (!isOpen) {
      // Open the book if closed
      setIsOpen(true);
      setCurrentSpread(0);
    } else {
      // Close the book when clicked again
      setIsOpen(false);
      setCurrentSpread(0);
    }
  };

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Our Menu</h2>
        
        <div className="max-w-4xl mx-auto perspective">
          {isOpen ? (
            // Open book
            <div 
              ref={bookRef}
              className="book-open"
              onClick={handleClick}
            >
              <div className="book-spread">
                {/* PDF Viewer */}
                <div className="book-page book-page-left shadow-lg">
                  <div id="adobe-dc-view" style={{ height: '600px' }}></div>
                </div>
                
                {/* Right page - empty or last page message */}
                <div className="book-page book-page-right shadow-lg">
                  <div className="last-page bg-white h-full">
                    <div className="p-6 h-full flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-center">Thank you for dining with us</p>
                      <p className="text-gray-400 text-center mt-4 italic">Click to close</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Closed book (just the cover)
            <div 
              className="book-cover cursor-pointer"
              onClick={handleClick}
            >
              <div className="cover-content flex flex-col items-center justify-center h-full bg-blue-900 text-white p-8 rounded-lg">
                <UtensilsCrossed className="w-32 h-32 text-amber-400 mb-8" />
                <h1 className="text-5xl font-bold text-white text-center mb-4">Menu</h1>
                <h2 className="text-3xl text-amber-400 text-center">Blue Whale Asian Fusion</h2>
                <p className="text-white text-center mt-8">Click to open</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS for the book animation */}
      <style jsx>{`
        .perspective {
          perspective: 1500px;
        }
        
        .book-cover {
          width: 100%;
          height: 600px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          transition: transform 0.3s, box-shadow 0.3s;
          transform-origin: center;
          position: relative;
          border-radius: 10px;
        }
        
        .book-cover:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px; 
          rgba(0,0,0,0.4);
        }
        
        .book-open {
          width: 100%;
          height: 600px;
          transform-style: preserve-3d;
          position: relative;
          cursor: pointer;
        }
        
        .book-spread {
          width: 100%;
          height: 100%;
          display: flex;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          transition: transform 0.5s;
        }
        
        .book-page {
          flex: 1;
          height: 100%;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .book-page-left {
          border-radius: 10px 0 0 10px;
          border-right: none;
          background-image: linear-gradient(to right, #f9fafb, #f3f4f6);
          position: relative;
        }
        
        .book-page-right {
          border-radius: 0 10px 10px 0;
          border-left: none;
          background-image: linear-gradient(to left, #f9fafb, #f3f4f6);
          position: relative;
        }
        
        .back-cover {
          background-image: linear-gradient(45deg, #1e3a8a, #2d4da0);
          border-radius: 10px 0 0 10px;
        }
        
        .content-page {
          padding: 30px;
        }
        
        @media (max-width: 768px) {
          .book-cover, .book-open {
            height: 500px;
          }
          
          .book-spread {
            flex-direction: column;
          }
          
          .book-page-left {
            display: none;
          }
          
          .book-page-right {
            border-radius: 10px;
            height: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default MenuSection;