'use client';

import React, { useState, useEffect, useRef, FC, FormEvent, KeyboardEvent } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Definisi Tipe (Type Definitions) ---
type Message = {
    type: 'user' | 'bot' | 'typing';
    text?: string;
    htmlContent?: string;
    id?: number;
};

type HistoryItem = string;

type SidebarProps = {
    history: HistoryItem[];
    onHistoryClick: (item: HistoryItem) => void;
    onNewChat: () => void;
    activeHistoryItem: HistoryItem | null;
    onDeleteHistory: (item: HistoryItem) => void; // Tambahan prop
};

type ChatMessageProps = {
    message: Message;
};

type PromptCardsProps = {
    onPromptClick: (prompt: string) => void;
};


// --- Komponen Anak (Child Components) ---

const WORKSPACES = [
    'Analisis Kredit',
    'Data Marketing',
    'Operasional',
    'Risiko',
    'Keuangan',
];

const Sidebar: FC<SidebarProps & { workspace: string; setWorkspace: (w: string) => void }> = ({ history, onHistoryClick, onNewChat, activeHistoryItem, onDeleteHistory, workspace, setWorkspace }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);
    return (
        <aside className="sidebar flex-shrink-0 w-64 border-r flex flex-col" style={{ backgroundColor: '#302C2D', borderRightColor: '#4a4546' }}>
            <div className="sidebar-border h-16 border-b flex flex-row items-center px-4 py-2" style={{ borderColor: '#4a4546' }}>
                <img src="/cimb-logo.png" alt="CIMB Logo" className="h-full max-h-[32px] w-auto mr-3" />
                <div className="flex flex-col items-start justify-center h-full">
                    <h1 className="text-[14px] font-normal" style={{ fontFamily: 'Poppins, sans-serif', color: '#fff' }}>Text2SQL</h1>
                    <p className="text-[10px] whitespace-nowrap" style={{ color: '#C8CDD3', fontFamily: 'Poppins, sans-serif' }}>powered by gaussian</p>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="mb-4">
                    <div className="relative mt-1" ref={ref}>
                        <button id="workspace-select" type="button" onClick={() => setOpen(v => !v)} className="sidebar-interactive-item w-full flex items-center justify-between px-3 py-2 text-sm text-left text-slate-200 rounded-lg" style={{ backgroundColor: '#3d3839' }}>
                            <span>{workspace}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        {open && (
                            <ul className="absolute left-0 z-10 mt-2 w-full min-w-[10rem] bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-fade-in">
                                {WORKSPACES.filter(w => w !== workspace).map(w => (
                                    <li key={w}>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-800"
                                            onClick={() => { setWorkspace(w); setOpen(false); }}
                                        >
                                            {w}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Chat
                </button>
                <nav className="mt-6">
                    <h2 className="text-xs font-normal" style={{ color: '#ffffff' }}>History</h2>
                    <div id="history-container" className="mt-2 space-y-1">
                        {/* pendingHistory && (
                            <div className="flex items-center gap-2 px-3 py-2 pr-8 text-sm rounded-lg text-slate-400 animate-pulse">
                                <span className="flex gap-1">
                                    <span className="inline-block w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="inline-block w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="inline-block w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </span>
                                <span className="ml-2">Menambahkan riwayat...</span>
                            </div>
                        ) */}
                        {history.map((item, index) => {
                            const isActive = item === activeHistoryItem;
                            return (
                                <div
                                    key={index}
                                    className={`group relative flex items-center`}
                                >
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onHistoryClick(item);
                                        }}
                                        className={`history-item block px-3 py-2 pr-8 text-sm rounded-lg truncate transition-colors w-full ${
                                            isActive
                                            ? 'bg-[#4a4546] text-slate-100 font-semibold'
                                            : 'hover:bg-[#4a4546]'
                                        }`}
                                        style={!isActive ? { color: '#F4F5F7' } : {}}
                                    >
                                        {item}
                                    </a>
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-transparent rounded focus:outline-none focus-visible:outline-none hover:bg-transparent"
                                        style={{ boxShadow: '0 0 0 2px transparent', transition: 'box-shadow 0.2s' }}
                                        title="Delete history"
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px #A8B0B8'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px transparent'; }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onDeleteHistory(item);
                                        }}
                                    >
                                        <img src="/trash.png" alt="Delete" className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </div>
            <div className="sidebar-border p-4 border-t" style={{ borderColor: '#4a4546' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center font-bold text-red-300">JD</div>
                    <div>
                        <p className="text-sm font-semibold text-slate-100">John Doe</p>
                        <p className="text-xs" style={{ color: '#C8CDD3' }}>Data Analyst</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const LLM_MODELS = [
    { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
    { label: 'GPT-4', value: 'gpt-4' },
    { label: 'Claude 3 Opus', value: 'claude-3-opus' },
    { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet' },
];

const Header: FC<{ model: string; setModel: (m: string) => void }> = ({ model, setModel }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);
    const active = LLM_MODELS.find(m => m.value === model)?.label || LLM_MODELS[0].label;
    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-[#121212]">Analytics Assistant</h2>
            <div className="flex items-center gap-2">
                <label htmlFor="llm-select" className="text-xs text-gray-600">Model:</label>
                <div className="relative" ref={ref}>
                    <button id="llm-select" type="button" onClick={() => setOpen(v => !v)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-left text-[#121212] bg-gray-100 rounded-md hover:bg-gray-200 min-w-40">
                        <span>{active}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    {open && (
                        <ul className="absolute left-0 z-10 mt-2 w-full min-w-[10rem] bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-fade-in">
                            {LLM_MODELS.map(opt => (
                                <li key={opt.value}>
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${model === opt.value ? 'font-semibold text-[#F52D2D]' : 'text-gray-800'}`}
                                        onClick={() => { setModel(opt.value); setOpen(false); }}
                                    >
                                        {opt.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </header>
    );
};

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    const { type, text, htmlContent, id } = message;

    // Fungsi untuk ekstrak isi dari blok kode chart (```chart ... ```) atau html/markdown
    function extractChartBlock(content?: string) {
        if (!content) return null;
        const match = content.match(/```chart\n([\s\S]*?)```/i);
        if (match) {
            try {
                return JSON.parse(match[1]);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    function extractHtmlBlock(content?: string) {
        if (!content) return '';
        // Jika ada <table> di dalam content, langsung render sebagai HTML
        if (/<table[\s\S]*?>[\s\S]*?<\/table>/.test(content)) {
            return content;
        }
        // Deteksi markdown tabel
        const isMarkdownTable = content.trim().startsWith('|') && content.includes('\n|---');
        if (isMarkdownTable) {
            // Konversi markdown tabel ke HTML
            const lines = content.trim().split(/\r?\n/).filter(Boolean);
            if (lines.length >= 2) {
                const headerCells = lines[0].split('|').slice(1, -1).map(cell => cell.trim());
                const rows = lines.slice(2).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
                let html = '<table><thead><tr>';
                html += headerCells.map(cell => `<th>${cell}</th>`).join('');
                html += '</tr></thead><tbody>';
                html += rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
                html += '</tbody></table>';
                return html;
            }
        }
        // regex untuk blok ```html ... ``` atau ```markdown ... ```
        const match = content.match(/```(?:html|markdown)?\n([\s\S]*?)```/i);
        if (match) {
            return match[1];
        }
        return content;
    }

    // Render chart jika ada blok chart
    const chartData = extractChartBlock(htmlContent);
    if (chartData && chartData.type && chartData.data) {
        let ChartComponent = null;
        switch (chartData.type) {
            case 'line':
                ChartComponent = <Line data={chartData.data} options={chartData.options || {}} />;
                break;
            case 'bar':
                ChartComponent = <Bar data={chartData.data} options={chartData.options || {}} />;
                break;
            case 'pie':
                ChartComponent = <Pie data={chartData.data} options={chartData.options || {}} />;
                break;
            case 'doughnut':
                ChartComponent = <Doughnut data={chartData.data} options={chartData.options || {}} />;
                break;
            default:
                ChartComponent = <pre>{JSON.stringify(chartData, null, 2)}</pre>;
        }
        return (
            <div className="flex items-start gap-4" id={`response-${id}`}>
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-[12px] p-4 text-[#121212]">
                        <div className="gemini-response-content overflow-x-auto text-[#121212]">
                            {ChartComponent}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'user') {
        return (
            <div className="flex items-start gap-4 justify-end">
                <div className="p-4 bg-red-600 text-white rounded-lg shadow-sm max-w-2xl">
                    <p>{text}</p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center font-bold text-red-300">JD</div>
            </div>
        );
    }

    if (type === 'typing') {
        return (
            <div className="flex items-start gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'bot') {
        return (
            <div className="flex items-start gap-4" id={`response-${id}`}>
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-[12px] p-4 text-[#121212]">
                        <div className="gemini-response-content overflow-x-auto text-[#121212]">
                            <div dangerouslySetInnerHTML={{ __html: extractHtmlBlock(htmlContent) }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-start gap-4" id={`response-${id}`}>
            <div className="gemini-response-content w-full max-w-2xl overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: extractHtmlBlock(htmlContent) }} />
            </div>
        </div>
    );
};

const InitialView: FC = () => (
    <div id="initial-view">
        <p style={{ fontSize: 24, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#302C2D' }}>
            How can I help you today?
        </p>
    </div>
);

const PromptCards: FC<PromptCardsProps> = ({ onPromptClick }) => {
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const CARDS_PER_PAGE = 4;
    const PROMPT_CARDS = [
        { title: "Loan Trends", description: "Show approved loan trends (last 2 fiscal years) as an interactive line chart." },
        { title: "Customer Performance", description: "List top 5 customers (largest portfolio) who haven't borrowed in the last year. Include contact and portfolio value." },
        { title: "Account Balance", description: "What's the average priority savings balance by region last quarter?" },
        { title: "Approval Efficiency", description: "Show average loan approval time per product type for the last 6 months." },
        { title: "Loan Risk", description: "Identify largest approved loans that are undisbursed and overdue (>30 days). Provide a CSV." },
        { title: "Card Activity", description: "List international credit card transactions (>Rp 10M) from last quarter. Provide a preview and download option." },
        { title: "Data Correlation", description: "Calculate and visualize loan amount vs. credit score correlation by region in a scatter plot." },
        { title: "Monthly NPL", description: "Display CIMB's monthly NPL ratio (last 12 months) in a line chart." },
    ];
    const totalPages = Math.ceil(PROMPT_CARDS.length / CARDS_PER_PAGE);
    const startIdx = page * CARDS_PER_PAGE;
    const visibleCards = PROMPT_CARDS.slice(startIdx, startIdx + CARDS_PER_PAGE);
    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    const handlePage = (newPage: number) => {
        setLoading(true);
        setTimeout(() => {
            setPage(newPage);
            setLoading(false);
        }, 800);
    };

    return (
        <div id="prompt-cards-section">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">Start with a topic</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => canPrev && handlePage(page - 1)} disabled={!canPrev || loading} className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button onClick={() => canNext && handlePage(page + 1)} disabled={!canNext || loading} className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-4 min-h-[120px]">
                {loading ? (
                    Array.from({ length: CARDS_PER_PAGE }).map((_, idx) => (
                        <div key={idx} className="w-[260px] min-h-[120px] bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col justify-between gap-y-3 shadow-lg animate-pulse">
                            <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-9 w-12 bg-gray-300 rounded" />
                        </div>
                    ))
                ) : (
                    visibleCards.map(card => (
                        <div key={card.title} className="w-[260px] min-h-[120px] bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col justify-between gap-y-3 shadow-lg">
                            <div>
                                <h4 className="font-bold text-[#F52D2D]">{card.title}</h4>
                                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                            </div>
                            <button onClick={async () => {
                                setLoading(true);
                                setTimeout(() => {
                                    onPromptClick(card.description);
                                    setLoading(false);
                                }, 800);
                            }} className="min-w-12 max-w-12 py-2 flex items-center justify-center border border-[#A8B0B8] text-[#A8B0B8] rounded-md transition-colors font-semibold text-sm hover:bg-[#A8B0B8]/10">
                                <img src="/generate-icon.png" alt="Prompt" className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Komponen Utama (Main App Component) ---

// Tambahkan API_KEY di sini (ganti dengan API key Gemini milikmu)
const API_KEY = "AIzaSyBHQyL3hzT1aU0zeOKUXXHDvLeiXuQkFtw";

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
    const [pendingHistory, setPendingHistory] = useState<string | null>(null);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const [model, setModel] = useState(LLM_MODELS[0].value);
    const [workspace, setWorkspace] = useState(WORKSPACES[0]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

    const callGeminiAPI = async (prompt: string, isJson: boolean = false): Promise<string> => {
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        const payload: any = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };
        if (isJson) {
            payload.generationConfig = { responseMimeType: "application/json" };
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": API_KEY,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} - ${errorText}`);
            }
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } catch (error) {
            console.error("Gemini API Error:", error);
            return `<div class=\"p-4 bg-rose-100 text-rose-700 rounded-lg\"><p class=\"font-bold\">Error</p><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
        }
    };
    
    const generateSuggestions = async (query: string) => {
        const prompt = `Based on the data analysis question: "${query}", provide 3 relevant and concise follow-up questions. Format the response as a JSON array of strings. Example: ["What is the NPL level per region?", "Who is the top product manager?", "Compare with the previous quarter."]`;
        try {
            const jsonString = await callGeminiAPI(prompt, true);
            let parsedSuggestions = [];
            try {
                parsedSuggestions = JSON.parse(jsonString);
                if (!Array.isArray(parsedSuggestions)) throw new Error('Not an array');
            } catch (e) {
                console.error("Failed to parse suggestions:", e, jsonString);
                parsedSuggestions = [];
            }
            setSuggestions(parsedSuggestions);
        } catch (e) {
            console.error("Failed to get suggestions:", e);
            setSuggestions([]);
        }
    };

    const handleUserQuery = async (query: string) => {
        setActiveHistoryItem(query);
        setMessages(prev => [...prev.filter(m => m.type !== 'user' || m.text !== query), { type: 'user', text: query }]);
        setUserInput('');
        setSuggestions([]);

        // Tambahkan ke history hanya jika memulai chat baru
        if (activeHistoryItem === null && !history.includes(query)) {
            setPendingHistory(query);
            setTimeout(() => {
                setHistory(prev => [query, ...prev].slice(0, 5));
                setPendingHistory(null);
            }, 800);
        }

        setTimeout(() => {
            setMessages(prev => [...prev.filter(m => m.type !== 'typing'), { type: 'typing' }]);
        }, 300);

        const prompt = `
You are an Analytics Assistant for CIMB. The user is a data analyst.

Always start your response with a short, friendly opening relevant to the user's question or topic.
Always end your response with a relevant closing, such as a summary or an invitation to ask more questions.

If the answer requires data visualization (such as a chart/graph), provide the chart data in a code block as follows, and the chart code block MUST stand alone (not in the middle of a sentence, not combined with other text):

<p>Here is the chart:</p>
\`\`\`chart
{
  "type": "line", // or bar, pie, etc.
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      { "label": "Loan", "data": [100, 200, 150], "borderColor": "#F52D2D", "backgroundColor": "rgba(245,45,45,0.2)" }
    ]
  },
  "options": {}
}
\`\`\`
<p>Additional explanation or insights below the chart.</p>

If the user requests a specific format (table, chart, CSV, etc.), follow that format.

NEVER put the chart code block in the middle of a sentence. The chart code block MUST start with \`\`\`chart on its own line, followed by JSON, and end with \`\`\` on its own line.

If no chart is needed, answer as usual.

ALWAYS respond in English for all content, explanations, and chart labels.

User Question: "${query}"
Only provide the content block.
`;

        const htmlResponse = await callGeminiAPI(prompt);

        setMessages(prev => prev.filter(m => m.type !== 'typing'));
        setMessages(prev => [...prev, { type: 'bot', htmlContent: htmlResponse, id: Date.now() }]);
        generateSuggestions(query);
    };
    
    const handleNewChat = () => {
        setMessages([]);
        setSuggestions([]);
        setUserInput('');
        setActiveHistoryItem(null);
    };

    const handleDeleteHistory = (item: HistoryItem) => {
        setHistory((prev) => prev.filter((h) => h !== item));
        if (item === activeHistoryItem) {
            setActiveHistoryItem(null);
            setMessages([]);
            setSuggestions([]);
            setUserInput('');
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        handleUserQuery(userInput);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!userInput.trim()) return;
            handleUserQuery(userInput);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                body { font-family: 'Poppins', sans-serif; font-size: 14px; }
                p, span, div, textarea, input, button, li, label, a {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 400;
                    font-size: 14px;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                }
                .gemini-response-content, .gemini-response-content * {
                    color: #121212 !important;
                }
                .gemini-response-content table {
                    width: 100%;
                    font-size: 0.95rem;
                    color: #121212;
                }
                .gemini-response-content th, .gemini-response-content td {
                    padding: 0.5rem;
                    border: 1px solid #e5e7eb;
                }
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: #E5E7EB; }
                ::-webkit-scrollbar-thumb { background: #9CA3AF; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #6B7280; }
                textarea { resize: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div className="flex h-screen antialiased text-slate-300">
                {sidebarOpen && (
                    <Sidebar
                        history={history}
                        onHistoryClick={handleUserQuery}
                        onNewChat={handleNewChat}
                        activeHistoryItem={activeHistoryItem}
                        onDeleteHistory={handleDeleteHistory}
                        workspace={workspace}
                        setWorkspace={setWorkspace}
                    />
                )}
                <main className="flex-1 min-w-0 flex flex-col bg-[#ECECEC]">
                    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen((v) => !v)}
                                className="flex items-center focus:outline-none"
                                aria-label="Toggle Sidebar"
                            >
                                <img src="/panel-left.png" alt="Panel" className="w-6 h-6 transition-transform duration-150 hover:scale-90" />
                                <div className="h-8 border-r mx-3" style={{ borderColor: '#E5E7EB' }} />
                            </button>
                            <h2 className="text-[16px] font-semibold text-[#121212]">
                                {activeHistoryItem ? activeHistoryItem : "Analytics Assistant"}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="llm-select" className="text-xs text-gray-600">Model:</label>
                            <div className="relative">
                                <button id="llm-select" type="button" onClick={() => setModelDropdownOpen(v => !v)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-left text-[#121212] bg-gray-100 rounded-md hover:bg-gray-200 min-w-40">
                                    <span>{LLM_MODELS.find(m => m.value === model)?.label || LLM_MODELS[0].label}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                {modelDropdownOpen && (
                                    <ul className="absolute left-0 z-10 mt-2 w-full min-w-[10rem] bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm animate-fade-in">
                                        {LLM_MODELS.map(opt => (
                                            <li key={opt.value}>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${model === opt.value ? 'font-semibold text-[#F52D2D]' : 'text-gray-800'}`}
                                                    onClick={() => { setModel(opt.value); setModelDropdownOpen(false); }}
                                                >
                                                    {opt.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </header>
                    <div ref={chatLogRef} className={`flex-1 p-6 overflow-y-auto space-y-6 ${messages.length === 0 ? 'flex flex-col justify-center items-start h-full px-12' : ''}`}>
                        {messages.length === 0 ? (
                            <div className="w-full flex flex-col gap-[14px] items-start">
                                <InitialView />
                                <PromptCards onPromptClick={handleUserQuery} />
                            </div>
                        ) : (
                            messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
                        )}
                    </div>
                    
                    
                    <div className="p-6 bg-white border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="relative">
                            <div className="relative flex items-center">
                                {/* Icon Add di kiri textarea */}
                                <img
                                    src="/add.png"
                                    alt="Add"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full h-12 py-3 pl-12 pr-20 text-gray-800 bg-gray-100 rounded-full transition-all placeholder-gray-500"
                                    placeholder="Ask your data question..."
                                    rows={1}
                                    onKeyDown={handleKeyDown}
                                />
                                {/* Icon Mic di kiri button enter */}
                                <img
                                    src="/mic.png"
                                    alt="Mic"
                                    className="absolute right-16 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md">
                                    <img src="/generate-icon.png" alt="Generate" className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                        <p className="mt-2 text-[13px] text-center" style={{ color: '#5D5D5D', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                            CIMBText2SQL can generate responses in Markdown, charts, CSV files, and execute Python code.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
