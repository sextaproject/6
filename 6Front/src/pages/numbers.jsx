import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Container, Tabs, Tab, Typography, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'; 

import BMI from '../components/bmi';
import NIHSS from '../components/nihss';
import HeartScore from '../components/heart';
import Glasgow from '../components/glasgow';
import WellsPE from '../components/wells';
import PERC from '../components/perc';
import TVPWells from '../components/tvp-wells';
import Curb65 from '../components/curb65';
import RenalCockcroft from '../components/CockcroftGault';
import RenalCKDEPI from '../components/CkdEpiCalculator';
import RenalMDRD from '../components/Mdrd';
import Osmolarity from '../components/Osmolaridad';
import HasBled from '../components/HasBled';
import ChadsVasc from '../components/ChadsVasc';
import SOFA from '../components/sofa';
import QSOFA from '../components/qSofa';
import AnionGap from '../components/a-gap';
import AaGradient from '../components/alv-art-grad';
import Electro from '../components/electrolitos';
import AcidBase from '../components/pH';

function Numbers(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
    setValue(newValue);
    };

    // Refs for enhanced scroll behaviors
    const tabsScrollRef = useRef(null);
    const tabsAutoScrollTimer = useRef(null);
    const workspaceRef = useRef(null);

    const startAutoScroll = (direction = 1) => {
      stopAutoScroll();
      const el = tabsScrollRef.current;
      if (!el) return;
      tabsAutoScrollTimer.current = window.setInterval(() => {
        el.scrollTop += 12 * direction; // smooth continuous scroll
      }, 16);
    };

    const stopAutoScroll = () => {
      if (tabsAutoScrollTimer.current) {
        clearInterval(tabsAutoScrollTimer.current);
        tabsAutoScrollTimer.current = null;
      }
    };

    // Smart section navigation for all calculators (detect legends/headings)
    const [sectionIndex, setSectionIndex] = useState(0);
    const getSections = () => {
      const root = workspaceRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll('legend, h1, h2, h3, [data-section]')
      ).filter(n => n.offsetParent !== null); // visible ones
    };
    const scrollToSection = (idx) => {
      const sections = getSections();
      if (sections.length === 0) return;
      const bounded = Math.max(0, Math.min(idx, sections.length - 1));
      const el = sections[bounded];
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      setSectionIndex(bounded);
    };
    const nextSection = () => scrollToSection(sectionIndex + 1);
    const prevSection = () => scrollToSection(sectionIndex - 1);

    // Keyboard shortcuts: Ctrl+ArrowUp / Ctrl+ArrowDown to jump sections
    useEffect(() => {
      const onKey = (e) => {
        if (e.ctrlKey && e.key === 'ArrowDown') { e.preventDefault(); nextSection(); }
        if (e.ctrlKey && e.key === 'ArrowUp') { e.preventDefault(); prevSection(); }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [sectionIndex]);

    return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: 'background.default', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      p: 2
    }}>
      
      <Paper elevation={3} sx={{ 
        minWidth: isMobile ? '100%' : '280px', 
        mb: isMobile ? 2 : 0,
        mr: isMobile ? 0 : 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        maxHeight: isMobile ? '180px' : 'calc(100vh - 48px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/menu"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="inherit"
            size="small"
            sx={{ mr: 1 }}
          >
            Volver al menú
          </Button>
          <Typography variant="h6" sx={{ fontFamily: 'Orbitron', letterSpacing: 1 }}>
            CÁLCULOS
          </Typography>
        </Box>
        
        <Box
          ref={tabsScrollRef}
          sx={{
            position: 'relative',
            borderRight: isMobile ? 0 : 1,
            borderColor: 'divider',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            variant="scrollable"
            value={value}
            onChange={(e, v) => { handleChange(e, v); if (workspaceRef.current) { workspaceRef.current.scrollTo({ top: 0, behavior: 'smooth' }); } setSectionIndex(0); }}
            sx={{ 
              '& .MuiTab-root': { alignItems: 'start', textAlign: 'left', minHeight: 48 } 
            }}
          >
            {/* 0-3: Vitals & Neuro */}
            <Tab label="Índice de Masa Corporal (IMC)" />
            <Tab label="Escala NIHSS" />
            <Tab label="Puntuación HEART" />
            <Tab label="Escala de Coma de Glasgow" />
            
            {/* 4-7: Vascular & Pulmonary */}
            <Tab label="Puntaje de Wells (TEP)" />
            <Tab label="Regla PERC" />
            <Tab label="Puntaje de Wells (TVP)" />
            <Tab label="CURB-65 (Neumonía)" />
            
            {/* 8-11: Renal */}
            <Tab label="Aclaramiento de creatinina (Cockcroft-Gault)" />
            <Tab label="CKD-EPI (2021)" />
            <Tab label="TFG MDRD" />
            <Tab label="Osmolaridad" />
            
            {/* 12-13: Cardiac Risk */}
            <Tab label="HAS-BLED" />
            <Tab label="CHA₂DS₂-VASc" />
            
            {/* 14-15: Sepsis */}
            <Tab label="Puntaje SOFA" />
            <Tab label="qSOFA" />
            
            {/* 16-19: Metabolic & Lab */}
            <Tab label="Brecha Aniónica" />
            <Tab label="Gradiente A-a" />
            <Tab label="Panel de Electrolitos" />
            <Tab label="Analizador de Gases Arteriales (ABG)" />
          </Tabs>

          {/* Hover zones for auto-scroll */}
          {!isMobile && (
            <>
              <Box
                onMouseEnter={() => startAutoScroll(-1)}
                onMouseLeave={stopAutoScroll}
                sx={{
                  position: 'sticky', top: 0, height: 10, zIndex: 2,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), transparent)'
                }}
              />
              <Box
                onMouseEnter={() => startAutoScroll(1)}
                onMouseLeave={stopAutoScroll}
                sx={{
                  position: 'sticky', bottom: 0, height: 10, zIndex: 2,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.03), transparent)'
                }}
              />
            </>
          )}
        </Box>
      </Paper>

      {/* --- RIGHT CONTENT AREA (The Workspace) --- */}
      <Box
        ref={workspaceRef}
        sx={{ 
          flexGrow: 1, 
          maxWidth: '900px',
          height: isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 100px)',
          overflowY: 'auto',
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '& > .calc-wrapper': { width: '100%' }
        }}
      >
        {/* Quick navigation button removed per request */}
        
        {/* Vitals & Neuro */}
        <Box className="calc-wrapper">
          {value === 0 && <BMI />}
          {value === 1 && <NIHSS />}
          {value === 2 && <HeartScore />}
          {value === 3 && <Glasgow />}
          
          {/* Vascular & Pulmonary */}
          {value === 4 && <WellsPE />}
          {value === 5 && <PERC />}
          {value === 6 && <TVPWells />}
          {value === 7 && <Curb65 />}
          
          {/* Renal */}
          {value === 8 && <RenalCockcroft />}
          {value === 9 && <RenalCKDEPI />}
          {value === 10 && <RenalMDRD />}
          {value === 11 && <Osmolarity />}
          
          {/* Cardiac Risk */}
          {value === 12 && <HasBled />}
          {value === 13 && <ChadsVasc />}
          
          {/* Sepsis */}
          {value === 14 && <SOFA />}
          {value === 15 && <QSOFA />}
          
          {/* Metabolic & Lab */}
          {value === 16 && <AnionGap />}
          {value === 17 && <AaGradient />}
          {value === 18 && <Electro />}
          {value === 19 && <AcidBase />}
        </Box>

      </Box>
    </Box>
  );
}

export default Numbers;

