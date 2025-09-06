import React, { useState, useRef, useEffect } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../../constants/color";

const HomeSectionCarousel = ({ data = [], sectionName = "Men's Kurta" }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure the refs array length matches data length
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, data.length);
  }, [data]);

  // Scroll card at index into center of container
  const scrollToIndex = (index, behavior = "smooth") => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    // compute left so card is centered
    const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left, behavior });
    setActiveIndex(index);
  };

  // Prev/Next handlers (one card at a time)
  const slidePrev = () => {
    const nextIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(nextIndex);
  };
  const slideNext = () => {
    const nextIndex = Math.min(data.length - 1, activeIndex + 1);
    scrollToIndex(nextIndex);
  };

  // While user scrolls, detect nearest card to container center and update activeIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        let nearest = 0;
        let minDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const dist = Math.abs(cardCenter - containerCenter);
          if (dist < minDist) {
            minDist = dist;
            nearest = i;
          }
        });
        if (nearest !== activeIndex) setActiveIndex(nearest);
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    // ensure initial centering (images might change sizes; retry once)
    scrollToIndex(activeIndex, "auto");
    const t = setTimeout(() => scrollToIndex(activeIndex, "auto"), 120);

    const onResize = () => scrollToIndex(activeIndex, "auto");
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // only re-run when data changes

  return (
    <div
      className="group"
      style={{ background: COLORS.carousel_gradient_soft || COLORS.carousel_bg_light || "#f5f5f5", borderRadius: "10px" }}
    >
      <div className="px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between py-3 sm:py-5">
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-800">{sectionName}</h2>
          <span className="text-xs sm:text-sm text-gray-500">
            {activeIndex + 1} of {data.length}
          </span>
        </div>

        {/* Scrollable area */}
        <div className="relative">
          {/* Buttons (kept) */}
          <button
            aria-label="Previous"
            onClick={slidePrev}
            disabled={activeIndex === 0}
            className={`absolute top-1/2 left-2 -translate-y-1/2 z-20 
              bg-white/90 hover:bg-gray-700 text-gray-700 hover:text-white 
              p-2 rounded-full shadow-md transition 
              ${activeIndex === 0 ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            aria-label="Next"
            onClick={slideNext}
            disabled={activeIndex >= data.length - 1}
            className={`absolute top-1/2 right-2 -translate-y-1/2 z-20 
              bg-white/90 hover:bg-gray-700 text-gray-700 hover:text-white 
              p-2 rounded-full shadow-md transition 
              ${activeIndex >= data.length - 1 ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
          >
            <ChevronRight size={18} />
          </button>

          {/* The actual scroll container */}
          <div
            ref={containerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-4 py-4
                       snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {data.map((item, idx) => (
              <div
                key={item.id || idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`
                  snap-center flex-shrink-0 
                  w-[85%] sm:w-[200px] md:w-[230px] lg:w-[260px]
                  flex justify-center
                `}
              >
                <HomeSectionCard product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSectionCarousel;
