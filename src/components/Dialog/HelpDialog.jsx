import React, { useState, useRef, useEffect } from 'react'
import { helpContent } from '../../data/helpContent'

const HelpDialog = ({ isOpen, onClose, language = 'ja', onLanguageChange, theme }) => {
  const modalRef = useRef(null)
  const mouseDownInsideRef = useRef(false)
  const [activeTab, setActiveTab] = useState('guide')

  // Handle mouse events to prevent modal closing on drag selections
  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (e) => {
      if (modalRef.current?.contains(e.target)) {
        mouseDownInsideRef.current = true
      } else {
        mouseDownInsideRef.current = false
      }
    }

    const handleMouseUp = (e) => {
      const clickedOutside = !modalRef.current?.contains(e.target)

      if (clickedOutside && !mouseDownInsideRef.current) {
        onClose()
      }

      mouseDownInsideRef.current = false
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const currentContent = helpContent[language]

  // テーマから見出し色を取得
  const getHeadingColor = () => {
    return theme.ui.helpHeading
  }

  // テーマからツール色を取得
  const getToolColor = () => {
    return theme.ui.helpToolColor
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        ref={modalRef}
        className="rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.ui.panel }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.ui.panelText }}>
              {currentContent.title}
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.ui.panelText, opacity: 0.7 }}>{currentContent.version}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="flex rounded-lg p-1" style={{ backgroundColor: theme.ui.button }}>
              <button
                onClick={() => onLanguageChange('ja')}
                className="px-3 py-1 rounded text-sm transition-colors"
                style={{
                  backgroundColor: language === 'ja' ? theme.ui.buttonActive : 'transparent',
                  color: theme.ui.panelText
                }}
                onMouseEnter={(e) => {
                  if (language !== 'ja') e.target.style.backgroundColor = theme.ui.buttonHover
                }}
                onMouseLeave={(e) => {
                  if (language !== 'ja') e.target.style.backgroundColor = 'transparent'
                }}
              >
                JP
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className="px-3 py-1 rounded text-sm transition-colors"
                style={{
                  backgroundColor: language === 'en' ? theme.ui.buttonActive : 'transparent',
                  color: theme.ui.panelText
                }}
                onMouseEnter={(e) => {
                  if (language !== 'en') e.target.style.backgroundColor = theme.ui.buttonHover
                }}
                onMouseLeave={(e) => {
                  if (language !== 'en') e.target.style.backgroundColor = 'transparent'
                }}
              >
                EN
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded transition-colors"
              style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
              title={currentContent.close}
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b" style={{ borderColor: theme.ui.border }}>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'guide' ? 'border-b-2' : ''
            }`}
            style={{
              color: activeTab === 'guide' ? getHeadingColor() : theme.ui.panelText,
              borderColor: activeTab === 'guide' ? getHeadingColor() : 'transparent',
              opacity: activeTab === 'guide' ? 1 : 0.7
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'guide') e.target.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'guide') e.target.style.opacity = '0.7'
            }}
          >
            {currentContent.tabs.guide}
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'changelog' ? 'border-b-2' : ''
            }`}
            style={{
              color: activeTab === 'changelog' ? getHeadingColor() : theme.ui.panelText,
              borderColor: activeTab === 'changelog' ? getHeadingColor() : 'transparent',
              opacity: activeTab === 'changelog' ? 1 : 0.7
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'changelog') e.target.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'changelog') e.target.style.opacity = '0.7'
            }}
          >
            {currentContent.tabs.changelog}
          </button>
        </div>
        
        <div className="space-y-6" style={{ color: theme.ui.panelText }}>
          {activeTab === 'guide' && (
            <>
              {/* About */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.about.title}</h3>
                <p style={{ color: theme.ui.panelText, whiteSpace: 'pre-wrap' }}>{currentContent.sections.about.content}</p>
              </section>

              {/* Settings */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.settings.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.settings.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Basic Controls */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.controls.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.controls.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Keyboard Shortcuts */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.keyboard.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.keyboard.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Line Tools */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.lineTools.title}</h3>
                <div className="space-y-3">
                  {currentContent.sections.lineTools.items.map((tool, index) => (
                    <div key={index}>
                      <strong style={{ color: getToolColor() }}>{tool.name}</strong>
                      <p className="ml-4" style={{ color: theme.ui.panelText }}>{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Grid Tools */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.gridTools.title}</h3>
                <div className="space-y-3">
                  {currentContent.sections.gridTools.items.map((tool, index) => (
                    <div key={index}>
                      <strong style={{ color: getToolColor() }}>{tool.name}</strong>
                      <p className="ml-4" style={{ color: theme.ui.panelText }}>{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Click Cycling */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.clickCycling.title}</h3>
                <div style={{ color: theme.ui.panelText }}>
                  {currentContent.sections.clickCycling.content.split('\n').map((line, index) => (
                    <p key={index} className={index === 0 ? 'mb-3' : 'mb-1'}>{line}</p>
                  ))}
                </div>
              </section>

              {/* Dungeon Options */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.dungeonOptions.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.dungeonOptions.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Floor Options */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.floorOptions.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.floorOptions.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Global Options */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.globalOptions.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.globalOptions.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Other Features */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.otherFeatures.title}</h3>
                <div className="space-y-2">
                  {currentContent.sections.otherFeatures.items.map((item, index) => (
                    <div key={index}><strong>{item.label}</strong> {item.desc}</div>
                  ))}
                </div>
              </section>

              {/* Notes */}
              <section>
                <h3 className="text-lg font-semibold mb-2" style={{ color: getHeadingColor() }}>{currentContent.sections.notes.title}</h3>
                <div className="space-y-2" style={{ color: theme.ui.panelText }}>
                  {currentContent.sections.notes.items.map((note, index) => (
                    <div key={index}>• {note}</div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'changelog' && (
            <section>
              <h3 className="text-lg font-semibold mb-4" style={{ color: getHeadingColor() }}>{currentContent.sections.changelog.title}</h3>
              <div className="space-y-4">
                {currentContent.sections.changelog.items.map((version, index) => (
                  <div key={index} className="border-l-4 pl-4" style={{ borderColor: getHeadingColor() }}>
                    <div className="flex items-center space-x-2 mb-2">
                      <strong style={{ color: getHeadingColor() }}>{version.version}</strong>
                      <span className="text-sm" style={{ color: theme.ui.panelText }}>({version.date})</span>
                    </div>
                    <div className="space-y-1" style={{ color: theme.ui.panelText }}>
                      {version.changes.map((change, changeIndex) => (
                        <div key={changeIndex}>• {change}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t mt-6 pt-4" style={{ borderColor: theme.ui.border || '#374151' }}>
          <div className="text-center text-sm" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
            <p className="mb-2">
              © 2025 DMapper - 3D Dungeon Mapping Tool
            </p>
            <p>
              <a 
                href="https://github.com/deadrah/dungeon-mapper" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: getHeadingColor() }}
              >
                GitHub Repository
              </a>
              {" | "}
              <span>Open Source Project</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
          >
            {currentContent.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpDialog