import React, { useState, useRef } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const MenuSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const bookRef = useRef(null);
  
  // Main content pages
  const contentPages = [
    {
      title: 'Curries',
      content: [
        {
          name: 'Green Curry',
          description: 'Spicy Green curry with Brocolli, Beans, Peppers, carrots, potato, bok choy',
          price: '€14.50/16.50/17.50/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Massaman Curry',
          description: 'Carrots, Beans, Brokoli, peppers, potato, bok choy and peanuts',
          price: '€14.50/16.50/17.50/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Red Curry',
          description: 'Red curry with Carrots, Beans, Brokoli, peppers, potato, bok choy',
          price: '€14.50/16.50/17.50/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Beef Rendang',
          description: 'Beef infused with aromatic spices, herbs and reduced coconut milk',
          price: '€16.50'
        },
        {
          name: 'Butter Chicken/Prawns/Mix',
          description: 'Smoky barbecued chicken Or Prawns cooked with Tomato based mild creamy curry',
          price: '€14.00/16.50/17.90'
        }
      ]
    },
    {
      title: 'From The Wok',
      content: [
        {
          name: 'Stir Fried',
          description: 'Onion, brocolli, carrots, beans, peppers, potato, bok choy serve with rice',
          price: '€14.70/16.99/17.99/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Pad Thai',
          description: 'Thai rice noodle sticks with fresh veggies, finished with scrambled egg and peanuts',
          price: '€13.90/16.50/17.50/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Yaki Udon',
          description: 'Stir fried Japanese thick Udon noodles sautéed with vegetables finished with soy',
          price: '€13.90/16.50/17.50/€19.70',
          note: 'Veg/CHK/Prawns/Mix'
        },
        {
          name: 'Sweet & Sour Chicken',
          description: 'Crispy fritters,onions, carrots, bell peppers & pineapple in sweet & sour sauce with rice',
          price: '€14.90'
        },
        {
          name: 'Chili Chicken',
          description: 'Crispy fritters tempered with Bell peppers and onions with soy garlic sauce, serve with rice',
          price: '€14.90'
        }
      ]
    },
    {
      title: 'Appetizers',
      content: [
        {
          name: 'Shrimp Crackers',
          description: 'Deep fried shrimp flavor crackers',
          price: '€3.99'
        },
        {
          name: 'Lemongrass Soup',
          description: 'Coconut soup infused with Lemongrass & kaffir lime leaves',
          price: '€4.49/5.50',
          note: 'Veg/CHK'
        },
        {
          name: 'Edamame',
          description: 'Boiled edamame with sea salt',
          price: '€4.99'
        },
        {
          name: 'Kimchi/Wakame Salad',
          description: 'Pickled kimchi or Seaweed Salad',
          price: '€6.99'
        },
        {
          name: 'Vege Spring Rolls',
          description: 'Homemade vegetable spring rolls',
          price: '€7.20'
        },
        {
          name: 'Dim Sums',
          description: 'Homemade dumplings (4pcs)',
          price: '€7.50',
          note: 'Veg/CHK/Pork'
        }
      ]
    },
    {
      title: 'Ramen & Specials',
      content: [
        {
          name: 'Chicken Ramen',
          description: 'Chicken, Noodles, Naruto, Egg, Spring onion, Nori',
          price: '€14.50'
        },
        {
          name: 'Pork Ramen',
          description: 'Pork, Noodles, Naruto, Egg, Spring onion, Nori',
          price: '€14.50'
        },
        {
          name: 'Bao Buns',
          description: 'Steamed Asian mini baos (choose any two): Kimchi Tofu | Crispy mushroom | Tikka Chicken | Spicy Beef | Tempura Prawn',
          price: '€16.95'
        }
      ]
    }
  ];

  // Calculate total number of page spreads (pairs of pages)
  // Each spread has a left and right page, except the first which has the cover back
  const totalSpreads = Math.ceil(contentPages.length / 2) + 1; // +1 for the cover spread

  const handleClick = () => {
    if (!isOpen) {
      // Open the book if closed
      setIsOpen(true);
      setCurrentSpread(0);
    } else {
      // If already open, go to next spread or close if on last spread
      if (currentSpread < totalSpreads - 1) {
        setCurrentSpread(currentSpread + 1);
      } else {
        // Close the book when we've reached the end
        setIsOpen(false);
        setCurrentSpread(0);
      }
    }
  };

  const renderContentPage = (pageIndex) => {
    const page = contentPages[pageIndex];
    if (!page) return null;
    
    return (
      <div className="content-page bg-white p-6 h-full overflow-auto">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">{page.title}</h3>
        <div className="space-y-4">
          {page.content?.map((item, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                <span className="text-amber-500 font-semibold whitespace-nowrap ml-2">{item.price}</span>
              </div>
              <p className="text-gray-600 text-xs">{item.description}</p>
              {item.note && (
                <p className="text-blue-600 text-xs">{item.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate which pages to show based on current spread
  const getPageIndices = () => {
    if (currentSpread === 0) {
      // First spread: back of cover and first content page
      return [null, 0];
    } else {
      // Other spreads: two content pages
      const leftPageIndex = (currentSpread * 2) - 1;
      const rightPageIndex = leftPageIndex + 1;
      return [leftPageIndex, rightPageIndex];
    }
  };

  const [leftPageIndex, rightPageIndex] = getPageIndices();
  
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
                {/* Left page - either blank blue (back of cover) or content */}
                <div className="book-page book-page-left shadow-lg">
                  {leftPageIndex === null ? (
                    // Back of cover (blue and blank)
                    <div className="back-cover bg-blue-900 h-full">
                      <div className="p-6 h-full flex items-center justify-center">
                        <p className="text-blue-200 text-center italic">Blue Whale Asian Fusion</p>
                      </div>
                    </div>
                  ) : (
                    // Regular content page
                    renderContentPage(leftPageIndex)
                  )}
                </div>
                
                {/* Right page - content */}
                <div className="book-page book-page-right shadow-lg">
                  {rightPageIndex < contentPages.length ? (
                    renderContentPage(rightPageIndex)
                  ) : (
                    <div className="last-page bg-white h-full">
                      <div className="p-6 h-full flex flex-col items-center justify-center">
                        <p className="text-gray-500 text-center">Thank you for dining with us</p>
                        <p className="text-gray-400 text-center mt-4 italic">Click to close</p>
                      </div>
                    </div>
                  )}
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
          box-shadow: 0 15px 30px rgba(0,0,0,0.4);
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
        
        .book-spread:hover {
          transform: translateY(-5px);
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
        
        .book-page-left::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.1));
          border-right: 1px solid rgba(0,0,0,0.1);
        }
        
        .book-page-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 100%;
          background: linear-gradient(to left, rgba(0,0,0,0.05), rgba(0,0,0,0.1));
          border-left: 1px solid rgba(0,0,0,0.1);
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