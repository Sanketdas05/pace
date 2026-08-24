import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, Check, RotateCcw, AlertTriangle, Sparkles, Save, Trash2 } from 'lucide-react';
import { CUSTOM_THEME_FIELDS, DEFAULT_CUSTOM_THEME } from '../../lib/themes';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../lib/firestore';
import { GROQ_URL, isDev, DEFAULT_AI_MODEL, parseAIJsonResponse } from '../../config/ai';

const groups = [...new Set(CUSTOM_THEME_FIELDS.map((f) => f.group))];

function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return [+r, +g, +b];
}

function luminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function ColorRow({ field, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-[var(--color-charcoal)]">{field.label}</span>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-[var(--color-smoke)] font-mono uppercase">{value}</span>
        <label className="relative cursor-pointer">
          <div
            className="w-8 h-8 rounded-xl border-2 border-[var(--color-mist)] shadow-sm overflow-hidden hover:scale-110 transition-transform"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
}

export default function CustomThemeBuilder() {
  const { activeThemeId, customTheme, updateCustomTheme, saveAndApplyCustom } = useTheme();
  const { currentUser, isDemoMode } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [openGroups, setOpenGroups] = useState({ App: true, Priority: true });
  const [saved, setSaved] = useState(false);
  const [localVars, setLocalVars] = useState(customTheme.vars);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  
  const [savedCloudThemes, setSavedCloudThemes] = useState([]);
  const [newThemeName, setNewThemeName] = useState('');
  const [isSavingNamed, setIsSavingNamed] = useState(false);

  useEffect(() => {
    const loadSavedThemes = async () => {
      if (currentUser && !isDemoMode) {
        const p = await getUserProfile(currentUser.uid);
        if (p?.savedThemes) setSavedCloudThemes(p.savedThemes);
      } else {
        const local = localStorage.getItem('taskflow-saved-themes');
        if (local) setSavedCloudThemes(JSON.parse(local));
      }
    };
    loadSavedThemes();
  }, [currentUser, isDemoMode]);

  const bgHex = localVars['--color-bg'] || '#F9F8F6';
  const textHex = localVars['--color-charcoal'] || '#2D2D2D';
  const contrastRatio = contrast(bgHex, textHex);
  const isLowContrast = contrastRatio < 2.5;

  const handleChange = (key, value) => {
    // If key is a dot color, also update bg versions with opacity
    const updates = { [key]: value };

    // Auto-derive high/medium/low bg from dot color with light opacity
    if (key === '--color-high-dot') updates['--color-high-bg'] = value + '22';
    if (key === '--color-medium-dot') updates['--color-medium-bg'] = value + '22';
    if (key === '--color-low-dot') updates['--color-low-bg'] = value + '22';
    // Sync primary-light slightly lighter
    if (key === '--color-primary') updates['--color-primary-light'] = value;

    // Smart Color Contrast Auto-Flip
    if (key === '--color-bg') {
      try {
        const rgb = hexToRgb(value);
        if (rgb && !isNaN(rgb[0])) {
          const lum = luminance(rgb[0], rgb[1], rgb[2]);
          if (lum < 0.4) {
            updates['--color-charcoal'] = '#F8FAFC'; // light text for dark bg
            updates['--color-smoke'] = '#94A3B8'; // light secondary
            updates['--color-mist'] = '#334155'; // dark border
          } else {
            updates['--color-charcoal'] = '#1E293B'; // dark text for light bg
            updates['--color-smoke'] = '#64748B'; // dark secondary
            updates['--color-mist'] = '#E2E8F0'; // light border
          }
        }
      } catch (e) {
        // ignore malformed hex
      }
    }

    setLocalVars(prev => ({ ...prev, ...updates }));
  };
  
  const generateThemeWithAI = async () => {
    if (!aiPrompt.trim() || isGeneratingTheme) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let newCount = 1;

    if (currentUser && !isDemoMode) {
      const userProfile = await getUserProfile(currentUser.uid);
      const limitStats = userProfile?.themeGenerations || { count: 0, month: currentMonth };
      
      if (limitStats.month === currentMonth) {
        if (limitStats.count >= 5) {
          alert("You have reached the limit of 5 AI Theme Generations for this month. Please try again next month.");
          return;
        }
        newCount = limitStats.count + 1;
      }
    }

    setIsGeneratingTheme(true);

    try {
      const systemPrompt = `You are an expert UI/UX designer. The user will give you a description for a UI theme.
You must return a raw JSON object containing exactly 9 hex color codes.

CRITICAL CONTRAST RULES:
- If you are generating a DARK theme (dark backgrounds), "--color-charcoal" MUST be a very light color (like #FFFFFF or #F3F4F6) and "--color-smoke" MUST be a medium-light color.
- If you are generating a LIGHT theme (light backgrounds), "--color-charcoal" MUST be a very dark color (like #111827) and "--color-smoke" MUST be a medium-dark color.
- "--color-mist" is used for borders, so it should be slightly lighter than a dark background, or slightly darker than a light background.

JSON KEYS TO PROVIDE:
"--color-bg" : The main background of the app.
"--color-surface" : Background for cards/modals (usually slightly lighter/darker than bg).
"--color-primary" : The main accent color (buttons, active states).
"--color-charcoal" : The primary text color. MUST contrast heavily with bg.
"--color-smoke" : The secondary/muted text color.
"--color-mist" : The border/divider color.
"--color-high-dot" : Accent for high priority (often red/pink/warm).
"--color-medium-dot" : Accent for medium priority (often yellow/orange).
"--color-low-dot" : Accent for low priority (often green/blue/cool).

Be creative with the exact hues to perfectly match the user's prompt (e.g. for "Batman" use black/dark grey with a bold yellow primary), but ALWAYS obey the contrast rules.
Return ONLY valid JSON format with these 9 keys. No markdown blocks, no explanations.`;

      const body = {
        model: DEFAULT_AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: aiPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      };

      const headers = { 'Content-Type': 'application/json' };
      if (!isDev) {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`;
      }

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to generate theme");

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const newColors = parseAIJsonResponse(content);
      
      Object.keys(newColors).forEach(k => {
         handleChange(k, newColors[k]);
      });

      setAiPrompt('');
      
      // Save rate limit stats
      if (currentUser && !isDemoMode) {
        await updateUserProfile(currentUser.uid, {
          themeGenerations: { count: newCount, month: currentMonth }
        });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate theme. Try again.");
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const handleSave = () => {
    const updatedTheme = updateCustomTheme(localVars);
    saveAndApplyCustom(updatedTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveNamedTheme = async () => {
    if (!newThemeName.trim()) return;
    const newTheme = { id: Date.now().toString(), name: newThemeName.trim(), vars: localVars };
    const updated = [...savedCloudThemes, newTheme];
    setSavedCloudThemes(updated);
    
    if (!isDemoMode && currentUser) {
      await updateUserProfile(currentUser.uid, { savedThemes: updated });
    } else {
      localStorage.setItem('taskflow-saved-themes', JSON.stringify(updated));
    }
    setNewThemeName('');
    setIsSavingNamed(false);
  };

  const handleDeleteNamedTheme = async (id) => {
    const updated = savedCloudThemes.filter(t => t.id !== id);
    setSavedCloudThemes(updated);
    if (!isDemoMode && currentUser) {
      await updateUserProfile(currentUser.uid, { savedThemes: updated });
    } else {
      localStorage.setItem('taskflow-saved-themes', JSON.stringify(updated));
    }
  };

  const handleApplyNamedTheme = (themeVars) => {
    setLocalVars(themeVars);
    const updatedTheme = updateCustomTheme(themeVars);
    saveAndApplyCustom(updatedTheme);
  };

  const handleReset = () => {
    setLocalVars(DEFAULT_CUSTOM_THEME.vars);
  };

  const toggleGroup = (g) => setOpenGroups((prev) => ({ ...prev, [g]: !prev[g] }));

  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--color-mist)] overflow-hidden">
      {/* Header toggle */}
      <button
        id="custom-theme-toggle"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-[var(--color-mist)]/40 transition-smooth"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Palette size={17} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--color-charcoal)]">🎨 Custom Theme Builder</p>
          <p className="text-xs text-[var(--color-smoke)]">Design your own color palette</p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown size={18} className="text-[var(--color-smoke)]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--color-mist)]">
              
              {/* AI Theme Generator */}
              <div className="mb-5 mt-2 p-3 bg-[var(--color-mist)]/30 rounded-2xl border border-[var(--color-mist)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[var(--color-primary)]" />
                  <p className="text-xs font-bold text-[var(--color-charcoal)]">AI Theme Generator</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Cyberpunk neon pink and dark blue"
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-mist)] rounded-xl px-3 py-2 text-xs text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-primary)]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') generateThemeWithAI();
                    }}
                  />
                  <button
                    onClick={generateThemeWithAI}
                    disabled={isGeneratingTheme || !aiPrompt.trim()}
                    className="px-3 py-2 rounded-xl text-white text-xs font-bold transition-smooth disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {isGeneratingTheme ? (
                      <div className="flex gap-1">
                        <motion.div animate={{y: [0, -2, 0]}} transition={{duration: 0.6, repeat: Infinity, delay: 0}} className="w-1.5 h-1.5 rounded-full bg-white"/>
                        <motion.div animate={{y: [0, -2, 0]}} transition={{duration: 0.6, repeat: Infinity, delay: 0.2}} className="w-1.5 h-1.5 rounded-full bg-white"/>
                        <motion.div animate={{y: [0, -2, 0]}} transition={{duration: 0.6, repeat: Infinity, delay: 0.4}} className="w-1.5 h-1.5 rounded-full bg-white"/>
                      </div>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>

              {/* Live Preview Strip */}
              <div className="mb-4 mt-3">
                <p className="text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-2">Live Preview</p>
                <div
                  className="w-full h-14 rounded-xl flex overflow-hidden border border-[var(--color-mist)]"
                  style={{ backgroundColor: localVars['--color-bg'] }}
                >
                  <div className="w-10 h-full" style={{ backgroundColor: localVars['--color-primary'] }} />
                  <div className="flex-1 flex items-center gap-2 px-3">
                    {['--color-high-dot', '--color-medium-dot', '--color-low-dot'].map((k) => (
                      <div key={k} className="flex items-center gap-1.5 flex-1">
                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: localVars[k] }} />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 rounded-full" style={{ backgroundColor: localVars['--color-mist'] }} />
                          <div className="h-1.5 w-2/3 rounded-full" style={{ backgroundColor: localVars['--color-mist'] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Groups */}
              {groups.map((group) => (
                <div key={group} className="mb-3">
                  <button
                    onClick={() => toggleGroup(group)}
                    className="w-full flex items-center justify-between py-1.5 mb-1"
                  >
                    <span className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-wider">{group}</span>
                    <motion.div animate={{ rotate: openGroups[group] ? 180 : 0 }} transition={{ duration: 0.18 }}>
                      <ChevronDown size={14} className="text-[var(--color-smoke)]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openGroups[group] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden divide-y divide-[var(--color-mist)]"
                      >
                        {CUSTOM_THEME_FIELDS.filter((f) => f.group === group).map((field) => (
                          <ColorRow
                            key={field.key}
                            field={field}
                            value={localVars[field.key] || '#000000'}
                            onChange={handleChange}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Warning Message */}
              <AnimatePresence>
                {isLowContrast && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2">
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-500">Low Contrast Warning</p>
                        <p className="text-[10px] text-red-500/80 mt-0.5">
                          The background and text colors are too similar. This will make the app unreadable. Please adjust them to continue.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-smooth text-white shadow-sm"
                    style={{ backgroundColor: '#475569' }}
                  >
                    <RotateCcw size={13} />
                    Reset
                  </motion.button>

                  <motion.button
                    id="apply-custom-theme-btn"
                    disabled={isLowContrast}
                    whileHover={!isLowContrast ? { scale: 1.02 } : {}}
                    whileTap={!isLowContrast ? { scale: 0.96 } : {}}
                    onClick={handleSave}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${
                      isLowContrast ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700' : 'text-white'
                    }`}
                    style={!isLowContrast ? { backgroundColor: 'var(--color-primary)' } : {}}
                  >
                    {saved ? (
                      <>
                        <Check size={15} />
                        Applied!
                      </>
                    ) : (
                      <>
                        <Palette size={15} />
                        Apply Custom Theme
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Save Named Theme Section */}
                <div className="bg-[var(--color-mist)]/30 border border-[var(--color-mist)] rounded-xl p-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="Theme name (e.g. Dark Neon)"
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-mist)] rounded-lg px-3 py-2 text-xs text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-primary)]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveNamedTheme();
                    }}
                  />
                  <button
                    onClick={handleSaveNamedTheme}
                    disabled={!newThemeName.trim() || isLowContrast}
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-smooth disabled:opacity-50 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Save size={14} /> Save to Cloud
                  </button>
                </div>
              </div>

              {/* My Saved Themes List */}
              {savedCloudThemes.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--color-mist)]">
                  <p className="text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-3">My Saved Themes</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {savedCloudThemes.map(theme => (
                      <div key={theme.id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)]">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-[var(--color-charcoal)]">{theme.name}</span>
                          <div className="flex overflow-hidden rounded-full border border-[var(--color-mist)] w-24 h-4" style={{ backgroundColor: theme.vars['--color-bg'] }}>
                            <div className="w-1/4 h-full" style={{ backgroundColor: theme.vars['--color-primary'] }} />
                            <div className="w-1/4 h-full" style={{ backgroundColor: theme.vars['--color-surface'] }} />
                            <div className="w-1/4 h-full" style={{ backgroundColor: theme.vars['--color-mist'] }} />
                            <div className="w-1/4 h-full" style={{ backgroundColor: theme.vars['--color-charcoal'] }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApplyNamedTheme(theme.vars)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-smooth"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => handleDeleteNamedTheme(theme.id)}
                            className="p-1.5 rounded-lg text-[var(--color-smoke)] hover:text-red-500 hover:bg-red-50 transition-smooth"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
