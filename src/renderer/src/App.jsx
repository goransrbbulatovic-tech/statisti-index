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
    const root = document.getElementById('root')
    if (!root) return

    if (!bg || bg === 'none') {
      root.style.backgroundImage = ''
      root.style.backgroundSize = ''
      root.style.backgroundPosition = ''
      root.style.backgroundAttachment = ''
    } else if (bg === 'custom' && customUrl) {
      root.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url("${customUrl}")`
      root.style.backgroundSize = 'cover'
      root.style.backgroundPosition = 'center'
      root.style.backgroundAttachment = 'fixed'
    } else {
      const BG_GRADIENTS = {
        'noir':       'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px),radial-gradient(ellipse at 20% 50%,rgba(40,30,10,0.5) 0%,transparent 60%),linear-gradient(160deg,#0a0805 0%,#0f0c08 40%,#060408 100%)',
        'cinema-red': 'radial-gradient(ellipse at 0% 0%,rgba(120,20,20,0.4) 0%,transparent 50%),radial-gradient(ellipse at 100% 100%,rgba(100,10,10,0.35) 0%,transparent 50%),linear-gradient(135deg,#0d0404 0%,#120808 40%,#0a0404 100%)',
        'cosmos':     'radial-gradient(2px 2px at 20% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 40% 70%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(2px 2px at 60% 15%,rgba(255,255,255,0.7) 0%,transparent 100%),radial-gradient(1px 1px at 80% 55%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 90% 80%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 10% 90%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(2px 2px at 50% 50%,rgba(147,197,253,0.3) 0%,transparent 100%),radial-gradient(ellipse at 30% 40%,rgba(29,78,216,0.2) 0%,transparent 50%),radial-gradient(ellipse at 70% 70%,rgba(109,40,217,0.15) 0%,transparent 50%),linear-gradient(160deg,#020408 0%,#030510 40%,#020208 100%)',
        'golden':     'radial-gradient(ellipse at 0% 100%,rgba(180,80,20,0.3) 0%,transparent 50%),radial-gradient(ellipse at 100% 0%,rgba(200,120,10,0.25) 0%,transparent 50%),linear-gradient(160deg,#0c0802 0%,#120e04 35%,#080600 100%)',
        'neon-city':  'radial-gradient(ellipse at 10% 90%,rgba(236,72,153,0.2) 0%,transparent 40%),radial-gradient(ellipse at 90% 10%,rgba(34,211,238,0.15) 0%,transparent 40%),radial-gradient(ellipse at 50% 50%,rgba(139,92,246,0.1) 0%,transparent 50%),linear-gradient(160deg,#030208 0%,#05030c 40%,#020108 100%)',
        'forest':     'radial-gradient(ellipse at 20% 80%,rgba(20,80,30,0.3) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(10,60,20,0.2) 0%,transparent 50%),linear-gradient(160deg,#020a04 0%,#040d06 40%,#010802 100%)',
        'ocean':      'radial-gradient(ellipse at 50% 0%,rgba(14,116,144,0.15) 0%,transparent 60%),radial-gradient(ellipse at 20% 60%,rgba(3,105,161,0.15) 0%,transparent 50%),linear-gradient(180deg,#020810 0%,#030c14 40%,#010608 100%)',
      }
      const gradient = BG_GRADIENTS[bg]
      if (gradient) {
        root.style.backgroundImage = gradient
        root.style.backgroundSize = 'cover'
        root.style.backgroundPosition = 'center'
        root.style.backgroundAttachment = 'fixed'
      }
    }

    // Make cards transparent when bg active
    const styleId = 'acmigo-bg-style'
    let styleEl = document.getElementById(styleId)
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = styleId; document.head.appendChild(styleEl) }
    if (!bg || bg === 'none') {
      styleEl.textContent = ''
    } else {
      styleEl.textContent = `
        #root { min-height: 100vh; }
        #root > div > main { background: transparent !important; }
        #root > div > aside { background: rgba(0,0,0,0.75) !important; backdrop-filter: blur(20px); }
        .card { background-color: rgba(18,18,30,0.82) !important; backdrop-filter: blur(12px); }
        .modal-content { background-color: rgba(18,18,30,0.96) !important; backdrop-filter: blur(20px); }
        .bg-\[\#0a0a14\], .bg-\[\#12121e\] { background-color: transparent !important; }
      `
    }

    setBgTheme(bg || 'none')
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
          if (filename) applyBg('custom', `bg://${filename}`)
        } else {
          applyBg(bg)
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
      <div className="flex flex-col h-screen bg-[#0a0a14] overflow-hidden">
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
