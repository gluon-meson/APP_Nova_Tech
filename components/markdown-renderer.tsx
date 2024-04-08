import 'github-markdown-css/github-markdown-light.css'
import './markdown-renderer.css'

import * as marked from 'marked'
import mermaid from 'mermaid'
import React, { useEffect, useState } from 'react'
import sanitizeHtml from 'sanitize-html'

interface MarkdownRendererProps {
  markdown: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const allowedTags = [
    'address',
    'article',
    'aside',
    'footer',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hgroup',
    'main',
    'nav',
    'section',
    'blockquote',
    'dd',
    'div',
    'dl',
    'dt',
    'figcaption',
    'figure',
    'hr',
    'li',
    'main',
    'ol',
    'p',
    'pre',
    'ul',
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'code',
    'data',
    'dfn',
    'em',
    'i',
    'kbd',
    'mark',
    'q',
    'rb',
    'rp',
    'rt',
    'rtc',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
    'wbr',
    'caption',
    'col',
    'colgroup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'del',
    'summary',
    'details',
  ]
  const allowedAttributes = {
    a: ['href', 'name', 'target'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
  }
  const [mermaidHtml, setMermaidHtml] = useState<string | null>(null)

  // Function to extract and render Mermaid code blocks
  const renderMermaidCode = async (
    tokens: marked.TokensList,
  ): Promise<string> => {
    let mermaidCode = ''

    for (const token of tokens) {
      if (
        token.type === 'code' &&
        token.lang &&
        token.lang.startsWith('mermaid')
      ) {
        const id = `mermaid-${Date.now()}`
        // Render Mermaid code as an image
        try {
          const svg = await mermaid.render(id, token.text)
          mermaidCode += svg.svg
          continue
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          document.querySelector(`#d${id}`)?.remove()
          mermaidCode += token.raw
        }
      }
      // Keep non-Mermaid code unchanged
      if ('raw' in token) {
        mermaidCode += sanitizeHtml(marked.parse(token.raw), {
          allowedTags,
          allowedAttributes,
        })
      }
    }
    return mermaidCode
  }
  useEffect(() => {
    const renderMarkdown = async () => {
      const tokens = marked.lexer(markdown)
      const result = await renderMermaidCode(tokens)
      setMermaidHtml(result)
    }
    renderMarkdown()
  }, [markdown])

  // Initialize mermaid once
  useEffect(() => {
    mermaid.initialize({
      theme: 'default',
      startOnLoad: true,
      securityLevel: 'loose',
    })
  }, [])

  return (
    <div className="markdown-body markdown leading-none">
      {mermaidHtml && (
        <div
          className="markdown-body markdown"
          dangerouslySetInnerHTML={{
            __html: mermaidHtml,
          }}
        />
      )}
    </div>
  )
}

export default MarkdownRenderer
