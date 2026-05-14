import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import StatistaList from './components/StatistaList'
import StatistaForm from './components/StatistaForm'
import StatistaProfile from './components/StatistaProfile'
import ProjektiPage from './components/ProjektiPage'
import RasporedPage from './components/RasporedPage'
import FinansijePage from './components/FinansijePage'
import GrupePage from './components/GrupePage'
import IzvjestajiPage from './components/IzvjestajiPage'
import Settings from './components/Settings'
import Toast from './components/Toast'

// ─── BACKGROUND GRADIENTS ────────────────────────────────────────────────────
const BG_GRADIENTS = {
  'noir':       'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px),radial-gradient(ellipse at 20% 50%,rgba(40,30,10,0.5) 0%,transparent 60%),linear-gradient(160deg,#0a0805 0%,#0f0c08 40%,#060408 100%)',
  'cinema-red': 'radial-gradient(ellipse at 0% 0%,rgba(140,20,20,0.45) 0%,transparent 50%),radial-gradient(ellipse at 100% 100%,rgba(120,10,10,0.35) 0%,transparent 50%),radial-gradient(ellipse at 50% 50%,rgba(80,5,5,0.2) 0%,transparent 60%),linear-gradient(135deg,#0d0404 0%,#180808 40%,#0a0404 100%)',
  'cosmos':     'radial-gradient(2px 2px at 15% 25%,rgba(255,255,255,0.7) 0%,transparent 100%),radial-gradient(1px 1px at 35% 65%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(2px 2px at 55% 10%,rgba(255,255,255,0.8) 0%,transparent 100%),radial-gradient(1px 1px at 75% 50%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(2px 2px at 88% 75%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 5% 88%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(3px 3px at 45% 40%,rgba(147,197,253,0.5) 0%,transparent 100%),radial-gradient(ellipse at 30% 40%,rgba(29,78,216,0.25) 0%,transparent 50%),radial-gradient(ellipse at 70% 70%,rgba(109,40,217,0.2) 0%,transparent 50%),linear-gradient(160deg,#020408 0%,#030510 40%,#020208 100%)',
  'golden':     'radial-gradient(ellipse at 0% 100%,rgba(180,80,20,0.35) 0%,transparent 50%),radial-gradient(ellipse at 100% 0%,rgba(200,130,10,0.3) 0%,transparent 50%),radial-gradient(ellipse at 50% 50%,rgba(150,80,10,0.15) 0%,transparent 60%),linear-gradient(160deg,#0c0802 0%,#160f03 35%,#080600 100%)',
  'neon-city':  'radial-gradient(ellipse at 10% 90%,rgba(236,72,153,0.25) 0%,transparent 40%),radial-gradient(ellipse at 90% 10%,rgba(34,211,238,0.2) 0%,transparent 40%),radial-gradient(ellipse at 50% 50%,rgba(139,92,246,0.12) 0%,transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(99,102,241,0.02) 3px,rgba(99,102,241,0.02) 6px),linear-gradient(160deg,#030208 0%,#05030c 40%,#020108 100%)',
  'forest':     'radial-gradient(ellipse at 20% 80%,rgba(20,80,30,0.35) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(10,60,20,0.25) 0%,transparent 50%),radial-gradient(ellipse at 50% 50%,rgba(5,40,15,0.15) 0%,transparent 60%),linear-gradient(160deg,#020a04 0%,#050f06 40%,#010802 100%)',
  'ocean':      'radial-gradient(ellipse at 50% 0%,rgba(14,116,144,0.2) 0%,transparent 60%),radial-gradient(ellipse at 20% 70%,rgba(3,105,161,0.18) 0%,transparent 50%),radial-gradient(ellipse at 80% 40%,rgba(7,89,133,0.15) 0%,transparent 50%),linear-gradient(180deg,#020810 0%,#030c18 40%,#01080e 100%)',
}

function BackgroundLayer({ bgTheme, bgCustomUrl }) {
  if (!bgTheme || bgTheme === 'none') return null

  const isCustom = bgTheme === 'custom'
  const gradient = isCustom ? null : BG_GRADIENTS[bgTheme]

  if (!isCustom && !gradient) return null
  if (isCustom && !bgCustomUrl) return null

  return (
    <>
      {/* Fixed background div — sits behind everything */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundImage: isCustom
          ? `linear-gradient(rgba(0,0,0,0.50),rgba(0,0,0,0.50)),url("${bgCustomUrl}")`
          : gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pointerEvents: 'none',
      }} />
      {/* Style injection for card transparency */}
      <style>{`
        body { background: transparent !important; }
        .bg-\[\#0a0a14\] { background-color: rgba(10,10,20,0.3) !important; }
        aside { background-color: rgba(5,5,12,0.80) !important; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
        .card { background-color: rgba(18,18,30,0.78) !important; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
        .modal-overlay { background: rgba(0,0,0,0.75) !important; backdrop-filter: blur(6px); }
        .modal-content { background-color: rgba(14,14,22,0.96) !important; backdrop-filter: blur(20px); }
      `}</style>
    </>
  )
}

export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const t=setTimeout(()=>setDebounced(value),delay); return ()=>clearTimeout(t) }, [value, delay])
  return debounced
}

export default function App() {
  const [page, setPage]             = useState('dashboard')
  const [pageParams, setPageParams] = useState({})
  const [statisti, setStatisti]     = useState([])
  const [projekti, setProjekti]     = useState([])
  const [statistike, setStatistike] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [search, setSearch]         = useState('')
  const [filters, setFilters]       = useState({})
  const [toasts, setToasts]         = useState([])
  const [selected, setSelected]     = useState([])
  const [theme, setTheme]           = useState('cinema')
  const [bgTheme, setBgTheme]       = useState('none')
  const [bgCustomUrl, setBgCustomUrl] = useState(null)
  const toastId = useRef(0)
  const debouncedSearch = useDebounce(search, 280)

  const navigate = useCallback((p, params={}) => { setPage(p); setPageParams(params); setSelected([]) }, [])

  const toast = useCallback((msg, type='success', duration=3000) => {
    const id = ++toastId.current
    setToasts(prev=>[...prev,{id,msg,type}])
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)), duration)
  }, [])

  const loadStatisti = useCallback(async (q, f) => {
    setLoading(true)
    try { const data=await window.api.getStatisti(q??debouncedSearch, f??filters); setStatisti(data||[]) }
    catch(e) { console.error(e); toast('Greška pri učitavanju','error') }
    finally { setLoading(false) }
  }, [debouncedSearch, filters, toast])

  const loadProjekti = useCallback(async () => {
    try { const data=await window.api.getProjekti(); setProjekti(data||[]) } catch(e){console.error(e)}
  }, [])

  const loadStatistike = useCallback(async () => {
    try { const data=await window.api.getStatistike(); setStatistike(data) } catch(e){console.error(e)}
  }, [])

  const refresh = useCallback(() => { loadStatisti(); loadProjekti(); loadStatistike() }, [loadStatisti, loadProjekti, loadStatistike])

  const applyBg = useCallback((bg, customUrl = null) => {
    setBgTheme(bg || 'none')
    if (bg === 'custom' && customUrl) {
      setBgCustomUrl(customUrl)
    }
    window.api?.setSetting?.('bg_theme', bg || 'none')
  }, [])

  const applyTheme = useCallback((t) => {
    document.documentElement.setAttribute('data-theme', t)
    setTheme(t)
    window.api?.setSetting?.('theme', t)
  }, [])

  useEffect(() => { loadStatisti(debouncedSearch, filters) }, [debouncedSearch, filters])

  useEffect(() => {
    loadProjekti()
    loadStatistike()
    window.api?.getSetting?.('theme','cinema').then(t=>{ const saved=t||'cinema'; document.documentElement.setAttribute('data-theme',saved); setTheme(saved) }).catch(()=>document.documentElement.setAttribute('data-theme','cinema'))
    // Load saved background
    window.api?.getSetting?.('bg_theme','none').then(async bg => {
      if (bg && bg !== 'none') {
        if (bg === 'custom') {
          const filename = await window.api?.getCustomBg?.()
          if (filename) {
            setBgCustomUrl(`bg://${filename}`)
            setBgTheme('custom')
          }
        } else {
          setBgTheme(bg)
        }
      }
    }).catch(() => {})
    window.api.onDbRestored?.(() => toast('Baza vraćena! Restartujte aplikaciju.','info',6000))
  }, [])

  const ctx = { page, navigate, pageParams, statisti, projekti, statistike, loading, search, setSearch, filters, setFilters, selected, setSelected, refresh, loadStatisti, loadProjekti, loadStatistike, toast, theme, applyTheme }

  const renderPage = () => {
    switch(page) {
      case 'dashboard':        return <Dashboard/>
      case 'statisti':         return <StatistaList/>
      case 'statista-new':     return <StatistaForm/>
      case 'statista-edit':    return <StatistaForm id={pageParams.id}/>
      case 'statista-profile': return <StatistaProfile id={pageParams.id}/>
      case 'projekti':         return <ProjektiPage/>
      case 'rasporedi':        return <RasporedPage/>
      case 'finansije':        return <FinansijePage/>
      case 'grupe':            return <GrupePage/>
      case 'izvjestaji':       return <IzvjestajiPage/>
      case 'settings':         return <Settings/>
      default:                 return <Dashboard/>
    }
  }

  return (
    <AppContext.Provider value={ctx}>
      <BackgroundLayer bgTheme={bgTheme} bgCustomUrl={bgCustomUrl} />
      <div className="flex flex-col h-screen bg-[#0a0a14] overflow-hidden" style={bgTheme && bgTheme !== 'none' ? {background:'transparent'} : {}}>
        <TitleBar/>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar/>
          <main className="flex-1 overflow-y-auto scrollbar-thin bg-[#0a0a14]">
            <div className="animate-fade-in">{renderPage()}</div>
          </main>
        </div>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map(t=><Toast key={t.id} {...t}/>)}
        </div>
      </div>
    </AppContext.Provider>
  )
}
