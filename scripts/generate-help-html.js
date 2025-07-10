#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { helpContent } from '../src/data/helpContent.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 共有データファイルからコンテンツを取得
const content = helpContent

// HTMLテンプレートを生成
function generateHtmlTemplate(lang, contentData, pageType = 'help') {
  const isHelp = pageType === 'help'
  const title = isHelp 
    ? `${contentData.title} | DMapper`
    : (lang === 'en' ? 'Update History | DMapper' : '更新履歴 | DMapper')
  
  const description = isHelp
    ? (lang === 'en' 
      ? 'Comprehensive guide for DMapper 3D dungeon mapping tool. Basic controls, keyboard shortcuts, tool explanations and more.'
      : '3Dダンジョンマッピングツール DMapper の詳細な使い方と操作方法。基本操作、キーボードショートカット、ツールの説明など。')
    : (lang === 'en' 
      ? 'Complete update history of DMapper. Detailed records of new features, improvements, and bug fixes for all versions.'
      : 'DMapper の全バージョンの更新履歴。新機能、改善点、バグ修正の詳細な記録。')
  
  const keywords = isHelp
    ? (lang === 'en' 
      ? 'DMapper,help,tutorial,guide,dungeon mapping,3D dungeon,wizardry-like,grid mapping,RPG,game mapping'
      : 'DMapper,使い方,操作方法,ヘルプ,チュートリアル,3Dダンジョン,マッピングツール,ウィザードリィライク,dungeon mapping,tutorial,help')
    : (lang === 'en' 
      ? 'DMapper,changelog,update history,version history,release notes,3D dungeon,wizardry-like'
      : 'DMapper,更新履歴,changelog,バージョン履歴,リリースノート,3Dダンジョン,マッピングツール,ウィザードリィライク')
  
  const canonicalUrl = isHelp 
    ? (lang === 'en' ? '/help/en/' : '/help/') 
    : (lang === 'en' ? '/help/en/changelog/' : '/help/changelog/')
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://deadrah.github.io/dungeon-mapper${canonicalUrl}">
    <meta property="og:site_name" content="DMapper">
    <meta property="og:image" content="https://deadrah.github.io/dungeon-mapper/og-image.png" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://deadrah.github.io/dungeon-mapper/twitter-card.png" />
    
    <link rel="canonical" href="https://deadrah.github.io/dungeon-mapper${canonicalUrl}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fafafa;
            font-size: 14px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #e0e0e0;
        }
        h1 { 
            color: #2c2c2c; 
            border-bottom: 2px solid #666; 
            padding-bottom: 10px; 
            font-weight: 600;
            margin-bottom: 25px;
            font-size: 24px;
        }
        h2 { 
            color: #404040; 
            margin-top: 30px; 
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 18px;
        }
        h3 { color: #555; font-size: 16px; }
        .nav { 
            margin-bottom: 30px; 
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .nav a { 
            display: inline-block; 
            margin-right: 20px; 
            padding: 8px 16px; 
            background: #666; 
            color: white; 
            text-decoration: none; 
            border-radius: 0;
            font-size: 13px;
            transition: background-color 0.2s;
        }
        .nav a:hover { background: #444; }
        .changelog-item {
            border-left: 3px solid #666;
            padding-left: 20px;
            margin-bottom: 25px;
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .version { 
            font-weight: 600; 
            color: #2c2c2c; 
            font-size: 15px;
        }
        .date { 
            color: #888; 
            font-size: 12px; 
            margin-bottom: 6px;
        }
        ul { 
            padding-left: 20px; 
            margin-top: 8px;
        }
        li { 
            margin-bottom: 4px; 
            color: #444;
            font-size: 14px;
        }
        .controls-grid {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 12px;
            margin: 15px 0;
            border: 1px solid #e0e0e0;
            padding: 20px;
            background: #f9f9f9;
        }
        .control-label { 
            font-weight: 500; 
            color: #2c2c2c;
            font-size: 14px;
        }
        p {
            margin-bottom: 10px;
            color: #444;
            font-size: 14px;
        }
        strong {
            color: #2c2c2c;
        }
        @media (max-width: 600px) {
            .controls-grid { 
                grid-template-columns: 1fr; 
                gap: 8px; 
                padding: 15px;
            }
            .control-label { margin-top: 15px; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="${lang === 'en' ? (isHelp ? '../../' : '../../../') : (isHelp ? '../' : '../../')}">${lang === 'en' ? 'Back to DMapper App' : 'DMapper アプリに戻る'}</a>
            ${isHelp 
              ? (lang === 'en' 
                ? '<a href="./changelog/">Changelog</a>' 
                : '<a href="./changelog/">更新履歴</a>')
              : (lang === 'en' 
                ? '<a href="../">Help</a>' 
                : '<a href="../">ヘルプ</a>')
            }
            ${lang === 'en'
              ? (isHelp 
                ? '<a href="../">日本語</a>'
                : '<a href="../../changelog/">日本語</a>')
              : (isHelp 
                ? '<a href="./en/">English</a>'
                : '<a href="../en/changelog/">English</a>')
            }
        </nav>
        
        <main>
            ${generateContent(contentData, pageType, lang)}
        </main>
        
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p><a href="../">DMapper</a> - 3D Dungeon Mapping Tool</p>
        </footer>
    </div>
</body>
</html>`
}

// コンテンツ部分を生成
function generateContent(contentData, pageType, lang) {
  if (pageType === 'changelog') {
    return generateChangelogContent(contentData)
  }
  return generateHelpContent(contentData)
}

// ヘルプコンテンツを生成
function generateHelpContent(contentData) {
  let html = `<h1>${contentData.title}</h1>`
  html += `<p><strong>${contentData.version}</strong></p>`
  
  if (contentData.sections) {
    Object.entries(contentData.sections).forEach(([key, section]) => {
      if (key === 'changelog') return // changelogは別ページ
      
      html += `<section>`
      html += `<h2>${section.title}</h2>`
      
      if (section.content) {
        // 改行文字で分割して段落を作成
        const paragraphs = section.content.split('\n').filter(p => p.trim())
        paragraphs.forEach(paragraph => {
          html += `<p>${paragraph.trim()}</p>`
        })
      }
      
      if (section.items) {
        if (key === 'controls' || key === 'keyboard') {
          html += '<div class="controls-grid">'
          section.items.forEach(item => {
            if (typeof item === 'object' && item.label && item.desc) {
              html += `<div class="control-label">${item.label}</div>`
              html += `<div>${item.desc}</div>`
            }
          })
          html += '</div>'
        } else {
          html += '<ul>'
          section.items.forEach(item => {
            if (typeof item === 'string') {
              html += `<li>${item}</li>`
            } else if (typeof item === 'object') {
              if (item.name && item.desc) {
                html += `<li><strong>${item.name}</strong> ${item.desc}</li>`
              } else if (item.label && item.desc) {
                html += `<li><strong>${item.label}</strong> ${item.desc}</li>`
              }
            }
          })
          html += '</ul>'
        }
      }
      
      html += `</section>`
    })
  }
  
  return html
}

// 更新履歴コンテンツを生成
function generateChangelogContent(contentData) {
  // changelogがsections内にあるか、直接プロパティとしてあるかチェック
  let changelogData = null
  let title = 'Update History'
  
  if (contentData.sections && contentData.sections.changelog) {
    changelogData = contentData.sections.changelog
    title = changelogData.title
  } else if (contentData.changelog) {
    // 直接changelogプロパティがある場合
    changelogData = { items: contentData.changelog }
    title = contentData.title === 'DMapper ヘルプ' ? '更新履歴' : 'Update History'
  } else {
    return `<h1>${title}</h1><p>No changelog data available</p>`
  }
  
  let html = `<h1>${title}</h1>`
  
  if (changelogData.items) {
    changelogData.items.forEach(item => {
      if (item.version && item.date && item.changes) {
        html += '<div class="changelog-item">'
        html += `<div class="version">${item.version}</div>`
        html += `<div class="date">${item.date}</div>`
        html += '<ul>'
        item.changes.forEach(change => {
          html += `<li>${change}</li>`
        })
        html += '</ul>'
        html += '</div>'
      }
    })
  }
  
  return html
}

// メイン実行関数
function main() {
  try {
    console.log('Generating help HTML pages...')
    
    // publicディレクトリ構造を作成
    const publicDir = path.join(__dirname, '../public')
    const helpDir = path.join(publicDir, 'help')
    const changelogDir = path.join(helpDir, 'changelog')
    const enDir = path.join(helpDir, 'en')
    const enChangelogDir = path.join(enDir, 'changelog')
    
    if (!fs.existsSync(helpDir)) {
      fs.mkdirSync(helpDir, { recursive: true })
    }
    if (!fs.existsSync(changelogDir)) {
      fs.mkdirSync(changelogDir, { recursive: true })
    }
    if (!fs.existsSync(enDir)) {
      fs.mkdirSync(enDir, { recursive: true })
    }
    if (!fs.existsSync(enChangelogDir)) {
      fs.mkdirSync(enChangelogDir, { recursive: true })
    }
    
    // 日本語版ヘルプページ生成
    console.log('Generating Japanese help page...')
    const jaHelpHtml = generateHtmlTemplate('ja', content.ja, 'help')
    fs.writeFileSync(path.join(helpDir, 'index.html'), jaHelpHtml)
    
    // 日本語版更新履歴ページ生成
    console.log('Generating Japanese changelog page...')
    const jaChangelogHtml = generateHtmlTemplate('ja', content.ja, 'changelog')
    fs.writeFileSync(path.join(changelogDir, 'index.html'), jaChangelogHtml)
    
    // 英語版ヘルプページ生成
    console.log('Generating English help page...')
    const enHelpHtml = generateHtmlTemplate('en', content.en, 'help')
    fs.writeFileSync(path.join(enDir, 'index.html'), enHelpHtml)
    
    // 英語版更新履歴ページ生成
    console.log('Generating English changelog page...')
    const enChangelogHtml = generateHtmlTemplate('en', content.en, 'changelog')
    fs.writeFileSync(path.join(enChangelogDir, 'index.html'), enChangelogHtml)
    
    console.log('✅ Help HTML pages generated successfully!')
    console.log(`- ${helpDir}/index.html (Japanese)`)
    console.log(`- ${changelogDir}/index.html (Japanese)`)
    console.log(`- ${enDir}/index.html (English)`)
    console.log(`- ${enChangelogDir}/index.html (English)`)
    
  } catch (error) {
    console.error('❌ Error generating help HTML pages:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合のみmainを呼び出し
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }