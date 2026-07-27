import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { PersistentOrderTicket, TicketItem } from './PersistentOrderTicket';
import { StoryChapterRail, CHAPTERS } from './StoryChapterRail';
import { ScanScene } from './ScanScene';
import { MenuSelectionScene } from './MenuSelectionScene';
import { KitchenPassScene } from './KitchenPassScene';
import { FloorRouteScene } from './FloorRouteScene';
import { ManagerSignalScene } from './ManagerSignalScene';
import { PayoffScene } from './PayoffScene';
import { OrderStatus } from '../../types';
import { Play, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export const FromScanToServeOverview: React.FC = () => {
  const {
    setActiveTab,
    simulateCustomerOrder,
    orders,
    menuItems,
    askAiQuestion,
    updateOrderStatus,
  } = useStore();

  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | 'SCANNING' | 'SELECTING'>('SCANNING');
  const [selectedTicketItems, setSelectedTicketItems] = useState<TicketItem[]>([
    {
      id: 'm1',
      name: 'Truffle & Forest Mushroom Arancini',
      qty: 1,
      price: 18.0,
      station: 'Fry / Prep',
      notes: 'No garlic on side',
    },
    {
      id: 'm2',
      name: 'Dry-Aged Wagyu Ribeye Steak',
      qty: 1,
      price: 46.0,
      station: 'Grill',
      notes: 'Medium rare, extra marrow jus',
    },
  ]);
  const [geminiInsight, setGeminiInsight] = useState<string>(
    'High Friday evening Wagyu demand predicted. Increase Station 2 prep allocation by +15% to maintain under 12-minute ticket times.'
  );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [liveStoryActive, setLiveStoryActive] = useState<boolean>(false);

  // Scroll references
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Update active chapter based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scenes = containerRef.current.querySelectorAll('.story-scene');
      const scrollTop = window.scrollY + window.innerHeight / 2;

      scenes.forEach((scene, index) => {
        const el = scene as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          setActiveChapter(index + 1);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific chapter element
  const scrollToChapter = (chapterId: number) => {
    setActiveChapter(chapterId);
    if (!containerRef.current) return;
    const scenes = containerRef.current.querySelectorAll('.story-scene');
    if (scenes[chapterId - 1]) {
      (scenes[chapterId - 1] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Toggle/Select Item on Ticket
  const handleToggleDish = (item: TicketItem) => {
    setSelectedTicketItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
    if (orderStatus === 'SCANNING') {
      setOrderStatus('SELECTING');
    }
  };

  // Advance Order Status
  const handleAdvanceStatus = (nextStatus: OrderStatus) => {
    setOrderStatus(nextStatus);
    // If real orders exist, update the most recent one in store too
    if (orders.length > 0) {
      updateOrderStatus(orders[0].id, nextStatus);
    }
  };

  // Run Live Order Story Animation
  const handleRunLiveOrderStory = () => {
    setLiveStoryActive(true);
    // 1. Trigger real store customer order simulation
    simulateCustomerOrder();

    // 2. Animate order ticket status through scenes sequentially
    setOrderStatus('pending');
    scrollToChapter(1);

    setTimeout(() => {
      scrollToChapter(2);
      setOrderStatus('SELECTING');
    }, 1500);

    setTimeout(() => {
      scrollToChapter(3);
      setOrderStatus('cooking');
    }, 3500);

    setTimeout(() => {
      scrollToChapter(4);
      setOrderStatus('ready');
    }, 5500);

    setTimeout(() => {
      scrollToChapter(5);
      setOrderStatus('served');
    }, 7500);

    setTimeout(() => {
      scrollToChapter(6);
      setOrderStatus('paid');
      setLiveStoryActive(false);
    }, 9500);
  };

  // Ask Gemini AI
  const handleAskGemini = async () => {
    setIsAiLoading(true);
    try {
      const res = await askAiQuestion(
        'Give a concise 2-sentence operational recommendation for tonight shift based on Table 04 Wagyu and Arancini sales.'
      );
      if (res) {
        setGeminiInsight(res);
      }
    } catch (e) {
      console.warn('Gemini refresh error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#171714] text-[#171714] selection:bg-[#E7A23B] selection:text-[#171714]">
      {/* Sticky Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#E7A23B] origin-left z-50 shadow-[0_0_10px_#E7A23B]"
      />

      {/* Floating Story Controller Header */}
      <div className="sticky top-16 z-40 bg-[#171714]/90 backdrop-blur-md border-b border-[#F4F0E8]/10 text-[#F4F0E8] py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-[#E7A23B]">
              From Scan to Serve
            </span>
            <span className="hidden md:inline text-xs font-mono text-[#F4F0E8]/60">
              Interactive Restaurant Operation Story
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunLiveOrderStory}
              disabled={liveStoryActive}
              className="px-3.5 py-1.5 bg-[#E7A23B] hover:bg-[#E7A23B]/90 text-[#171714] font-mono text-xs font-bold rounded-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-[#171714]" />
              <span>{liveStoryActive ? 'Running Live Order...' : 'Run Live Order Story'}</span>
            </button>

            <button
              onClick={() => setActiveTab('customer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F0E8] hover:bg-[#F4F0E8]/90 text-[#171714] font-mono text-xs font-bold rounded-xs transition-all"
            >
              <span>Enter Operational App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Story Scenes on Left, Sticky Ticket + Chapter Rail on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6 Chapter Scenes */}
        <div className="lg:col-span-8 space-y-12">
          <div className="story-scene" id="chapter-1">
            <ScanScene isScanned={orderStatus !== 'SCANNING'} />
          </div>

          <div className="story-scene" id="chapter-2">
            <MenuSelectionScene
              onSelectItem={handleToggleDish}
              selectedItems={selectedTicketItems}
              onOpenCustomerMenu={() => setActiveTab('customer')}
            />
          </div>

          <div className="story-scene" id="chapter-3">
            <KitchenPassScene
              orderStatus={orderStatus}
              onAdvanceStatus={handleAdvanceStatus}
              onOpenKitchenKds={() => setActiveTab('kitchen')}
              ticketItems={selectedTicketItems}
            />
          </div>

          <div className="story-scene" id="chapter-4">
            <FloorRouteScene
              orderStatus={orderStatus}
              onMarkServed={() => handleAdvanceStatus('served')}
              onOpenFloorMap={() => setActiveTab('staff')}
            />
          </div>

          <div className="story-scene" id="chapter-5">
            <ManagerSignalScene
              orderTotal={selectedTicketItems.reduce((acc, i) => acc + i.price * i.qty, 0)}
              totalOrdersCount={orders.length}
              onOpenManagerAnalytics={() => setActiveTab('analytics')}
              onAskGemini={handleAskGemini}
              geminiInsightText={geminiInsight}
              isAiLoading={isAiLoading}
            />
          </div>

          <div className="story-scene" id="chapter-6">
            <PayoffScene
              onRunLiveOrderStory={handleRunLiveOrderStory}
              onEnterApp={() => setActiveTab('customer')}
            />
          </div>
        </div>

        {/* Right Column: Sticky Chapter Rail + Sticky Persistent Order Ticket */}
        <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
          {/* Chapter Rail Navigation */}
          <StoryChapterRail
            activeChapter={activeChapter}
            onSelectChapter={scrollToChapter}
          />

          {/* Persistent Order Ticket Object */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] font-bold text-[#F4F0E8]/60 tracking-wider uppercase flex items-center justify-between px-1">
              <span>PERSISTENT STORY OBJECT</span>
              <span className="text-[#E7A23B]">TABLE 04 TICKET</span>
            </div>

            <PersistentOrderTicket
              orderId="#ORD-8042"
              tableNumber={4}
              customerName="Diner Guest • Table 04"
              status={orderStatus}
              items={selectedTicketItems}
              elapsedSeconds={245}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
