import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Pin, Star, ChevronLeft, Settings, 
  Wifi, Monitor, Server, Shield, Users, Mail, Globe, Cloud,
  Plus, Check, Copy, Home, Folder, Clock, User
} from 'lucide-react';
import { CATEGORIES, FIXES } from './data';

const IconMap = {
  Wifi, Monitor, Server, Shield, Users, Mail, Globe, Cloud,
  Home, Folder, Clock, Settings, Search, Pin, Star, ChevronLeft,
  Plus, Check, Copy, User
};

const DynamicIcon = ({ name, ...props }) => {
  const Icon = IconMap[name] || Globe;
  return <Icon {...props} />;
};

// --- Sub-components (Premium Versions) ---

const Tag = ({ label }) => {
  return (
    <span className="mono" style={{ 
      fontSize: '0.65rem', 
      fontWeight: '600',
      padding: '0.2rem 0.5rem',
      borderRadius: '0.4rem',
      backgroundColor: 'var(--accent-dim)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-glow)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      #{label}
    </span>
  );
};

const PinnedCard = ({ fix, onClick }) => {
  const category = CATEGORIES.find(c => c.id === fix.category);
  const color = category ? category.color : 'var(--accent)';
  
  return (
    <div className="card-premium animate-fade" onClick={onClick} style={{ 
      minWidth: '280px', 
      marginRight: '1rem',
      position: 'relative',
      borderLeft: `3px solid ${color}`,
      background: `linear-gradient(135deg, ${color}05 0%, var(--bg-card) 40%)`
    }}>
      <div className="mono" style={{ color: color, fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: '700' }}>
        {fix.tags[0].toUpperCase()}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.2' }}>{fix.title}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{fix.summary}</p>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
        <Star size={16} fill={fix.starred ? "#fbbf24" : "none"} color={fix.starred ? "#fbbf24" : "var(--text-muted)"} />
      </div>
    </div>
  );
};

const FixListItem = ({ fix, onClick }) => {
  return (
    <div className="card-premium animate-fade" onClick={onClick} style={{ marginBottom: '0.75rem', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{fix.title}</h4>
        <div style={{ opacity: 0.6 }}>
          <Star size={14} fill={fix.starred ? "#fbbf24" : "none"} color={fix.starred ? "#fbbf24" : "var(--text-muted)"} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {fix.tags.map(tag => <Tag key={tag} label={tag} />)}
      </div>
      <div style={{ fontSize: '0.7rem' }} className="mono">
        <span style={{ color: 'var(--text-muted)' }}>LAST UPDATED:</span> <span style={{ color: 'var(--accent)' }}>{fix.updatedAgo.toUpperCase()}</span>
      </div>
    </div>
  );
};

const CategoryCard = ({ cat, onClick }) => {
  return (
    <div className="card-premium animate-fade" onClick={onClick} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      aspectRatio: '1/1',
      padding: '1rem',
      gap: '0.75rem'
    }}>
      <div style={{ 
        width: '3.5rem', 
        height: '3.5rem', 
        borderRadius: '1rem', 
        background: `${cat.color}15`, 
        color: cat.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 15px ${cat.color}20`
      }}>
        <DynamicIcon name={cat.icon} size={28} strokeWidth={2.5} />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{cat.label}</span>
    </div>
  );
};

const DetailOverlay = ({ fix, onBack }) => {
  const [completed, setCompleted] = useState({});
  const toggle = (i) => setCompleted(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="detail-view" style={{ 
      position: 'absolute', inset: 0, zIndex: 100, background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ 
        padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', 
        borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' 
      }}>
        <button className="icon-btn" onClick={onBack} style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fix.title}
        </h2>
        <Star size={20} fill={fix.starred ? "#fbbf24" : "none"} color={fix.starred ? "#fbbf24" : "var(--text-muted)"} />
      </div>
      
      <div className="scroll-container" style={{ padding: '1.5rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {fix.tags.map(tag => <Tag key={tag} label={tag} />)}
        </div>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', background: 'var(--accent-dim)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--accent-glow)' }}>
          {fix.summary}
        </p>
        
        <h3 className="mono" style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={16} strokeWidth={3} /> STEPS TO RESOLVE
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {fix.steps.map((step, i) => (
            <div key={i} onClick={() => toggle(i)} className="card-premium" style={{ 
              padding: '0.85rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: completed[i] ? 'rgba(255,255,255,0.03)' : 'var(--bg-card)',
              opacity: completed[i] ? 0.5 : 1
            }}>
              <div style={{ 
                width: '1.5rem', height: '1.5rem', borderRadius: '0.5rem',
                background: completed[i] ? 'var(--accent)' : 'var(--accent-dim)',
                color: completed[i] ? 'var(--bg-primary)' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '0.75rem', fontWeight: '800'
              }} className="mono">
                {completed[i] ? <Check size={12} strokeWidth={4} /> : i + 1}
              </div>
              <div style={{ 
                fontSize: '0.9rem', lineHeight: '1.5', 
                textDecoration: completed[i] ? 'line-through' : 'none',
                color: completed[i] ? 'var(--text-muted)' : 'var(--text-primary)'
              }}>
                {step.split(/(`.+?`)/g).map((part, idx) => 
                  part.startsWith('`') ? <code key={idx} className="mono" style={{ color: 'var(--accent)', background: 'var(--accent-dim)', padding: '0.1rem 0.3rem', borderRadius: '0.3rem', fontSize: '0.85em' }}>{part.slice(1, -1)}</code> : part
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [tab, setTab] = useState('home'); // home, categories, recent
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFix, setSelectedFix] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const scrollRef = useRef(null);

  // Filter Logic
  const filteredFixes = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return FIXES.filter(f => 
      f.title.toLowerCase().includes(q) || 
      f.summary.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const categoryFixes = useMemo(() => {
    if (!selectedCategory) return [];
    return FIXES.filter(f => f.category === selectedCategory.id);
  }, [selectedCategory]);

  return (
    <div className="app-container">
      <div className="scanline"></div>
      
      {/* Header */}
      <header style={{ 
        padding: '1.25rem 1.25rem 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0, background: 'linear-gradient(to bottom, var(--bg-primary), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '2rem', height: '2rem', background: 'var(--accent)', borderRadius: '0.6rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--accent-glow)'
          }}>
            <Globe size={18} color="var(--bg-primary)" strokeWidth={3} />
          </div>
          <h1 className="mono" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
            Pocket<span style={{ color: 'var(--accent)' }}>KB</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="icon-btn" style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <User size={20} color="var(--text-secondary)" />
          </button>
          <button className="icon-btn" style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <Settings size={20} color="var(--text-secondary)" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '0.75rem 1.25rem 1rem' }}>
        <div style={{ 
          position: 'relative', display: 'flex', alignItems: 'center',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '1rem',
          padding: '0.25rem 0.75rem', transition: 'all 0.3s ease',
          boxShadow: searchQuery ? '0 0 20px var(--accent-glow)' : 'none',
          borderColor: searchQuery ? 'var(--accent)' : 'var(--border)'
        }}>
          <Search size={18} color={searchQuery ? 'var(--accent)' : 'var(--text-muted)'} />
          <input 
            type="text" 
            placeholder="Search problems, commands, error codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)',
              padding: '0.75rem', width: '100%', fontSize: '0.95rem'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mono" style={{ 
              background: 'var(--accent-dim)', border: 'none', color: 'var(--accent)', 
              borderRadius: '0.4rem', padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontWeight: '900'
            }}>ESC</button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="scroll-container" ref={scrollRef}>
        {filteredFixes ? (
          <div className="animate-fade">
            <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.15em' }}>
              RESULTS ({filteredFixes.length})
            </h2>
            {filteredFixes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No fixes found matching "{searchQuery}"
              </div>
            ) : (
              filteredFixes.map(fix => <FixListItem key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />)
            )}
          </div>
        ) : tab === 'home' ? (
          <>
            <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pin size={12} strokeWidth={3} color="var(--accent)" /> PINNED FIXES
            </h2>
            <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none' }}>
              {FIXES.filter(f => f.pinned).map(fix => (
                <PinnedCard key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={12} strokeWidth={3} color="var(--accent)" /> RECENT ACTIVITY
              </h2>
              <button onClick={() => setTab('recent')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '700' }}>VIEW ALL</button>
            </div>
            {FIXES.filter(f => !f.pinned).slice(0, 3).map(fix => (
              <FixListItem key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0 1rem' }}>
              <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Folder size={12} strokeWidth={3} color="var(--accent)" /> CATEGORIES
              </h2>
              <button onClick={() => setTab('categories')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '700' }}>EXPLORE</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {CATEGORIES.slice(0, 4).map(cat => (
                <CategoryCard key={cat.id} cat={cat} onClick={() => setSelectedCategory(cat)} />
              ))}
            </div>
          </>
        ) : tab === 'categories' ? (
          <div className="animate-fade">
             <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '0.15em' }}>
              ALL CATEGORIES
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.id} cat={cat} onClick={() => setSelectedCategory(cat)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade">
            <h2 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '0.15em' }}>
              RECENTLY UPDATED
            </h2>
            {FIXES.map(fix => (
              <FixListItem key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab" style={{ 
        position: 'absolute', bottom: '5.5rem', right: '1.25rem', width: '3.5rem', height: '3.5rem',
        borderRadius: '1.1rem', background: 'var(--accent)', color: 'var(--bg-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 16px -4px rgba(0, 242, 255, 0.4)', border: 'none'
      }}>
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* Navigation */}
      <nav style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4.5rem',
        background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)', backdropFilter: 'blur(20px)'
      }}>
        {[
          { id: 'home', icon: Home, label: 'HOME' },
          { id: 'categories', icon: Folder, label: 'KNOWLEDGE' },
          { id: 'recent', icon: Clock, label: 'ACTIVITY' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => { setTab(item.id); setSearchQuery(''); }}
            style={{ 
              background: 'none', border: 'none', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', gap: '0.4rem', color: tab === item.id ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.3s ease', transform: tab === item.id ? 'translateY(-2px)' : 'none'
            }}
          >
            <item.icon size={22} strokeWidth={tab === item.id ? 2.5 : 2} />
            <span className="mono" style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>{item.label}</span>
            {tab === item.id && <div style={{ width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-glow)' }}></div>}
          </button>
        ))}
      </nav>

      {/* Detail Overlay */}
      {selectedFix && <DetailOverlay fix={selectedFix} onBack={() => setSelectedFix(null)} />}
      
      {/* Category Selection Overlay */}
      {selectedCategory && (
        <div className="detail-view" style={{ 
          position: 'absolute', inset: 0, zIndex: 90, background: 'var(--bg-primary)',
          display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ 
            padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', 
            borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' 
          }}>
            <button className="icon-btn" onClick={() => setSelectedCategory(null)} style={{ color: 'var(--accent)' }}>
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <div style={{ 
              width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', 
              background: `${selectedCategory.color}15`, color: selectedCategory.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <DynamicIcon name={selectedCategory.icon} size={16} strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
              {selectedCategory.label}
            </h2>
          </div>
          <div className="scroll-container">
            {categoryFixes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                No database entries for this category.
              </div>
            ) : (
              categoryFixes.map(fix => <FixListItem key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
