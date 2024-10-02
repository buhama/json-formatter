'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'

// Dynamically import react-json-view to avoid Next.js SSR issues
const ReactJson = dynamic(() => import('searchable-react-json-view'), { ssr: false })
const CodeEditor = dynamic(() => import('react-simple-code-editor'), { ssr: false })
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [indentation, setIndentation] = useState(2)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setParsedJson(parsed)
      setError('')
    } catch (e) {
      setError('Invalid JSON')
      setParsedJson(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Syntax highlighting for the code editor
  const highlight = (code: string) => {
    let highlighted = Prism.highlight(code, Prism.languages.json, 'json')

    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark>$1</mark>')
    }

    return highlighted
  }

  return (
    <div className="container mx-auto p-4 min-h-screen text-gray-200">
      <Card className="border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">JSON Formatter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search" className="text-gray-300">Search</Label>
            <Input
              id="search"
              placeholder="Search for values"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 text-gray-200 border-gray-600"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 space-y-4">
              <div>
                <Label htmlFor="input" className="text-gray-300">Input JSON</Label>
                <div
                  className="h-[calc(100vh-300px)] min-h-[200px] bg-neutral-900 text-gray-200 border border-gray-600 rounded-md overflow-auto"
                >
                  <CodeEditor
                    value={input}
                    onValueChange={(code: string) => setInput(code)}
                    highlight={highlight}
                    padding={10}
                    className="editor"
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      height: '100%', // Add this line
                      minHeight: '100%', // Ad
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <RadioGroup
                  defaultValue="2"
                  onValueChange={(value) => setIndentation(Number(value))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="r1" />
                    <Label htmlFor="r1" className="text-gray-300">2 spaces</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="r2" />
                    <Label htmlFor="r2" className="text-gray-300">4 spaces</Label>
                  </div>
                </RadioGroup>
                <Button onClick={formatJSON}>Format JSON</Button>
              </div>
              {error && <div className="text-red-400">{error}</div>}
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="output" className="text-gray-300">Formatted JSON</Label>
              {parsedJson ? (
                <div
                  id="output"
                  className="bg-neutral-900 rounded-md overflow-auto h-[calc(100vh-300px)] min-h-[200px] text-gray-200"
                >
                  <ReactJson
                    src={parsedJson}
                    theme="monokai"
                    collapsed={false}
                    enableClipboard={true}
                    displayDataTypes={false}
                    indentWidth={indentation}
                    highlightSearch={searchTerm}
                  />
                </div>
              ) : (
                <div className="bg-neutral-900 p-4 rounded-md h-[calc(100vh-300px)] min-h-[200px] flex items-center justify-center text-gray-400">
                  Formatted JSON will appear here
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant={'secondary'} onClick={() => copyToClipboard(input)}>
                  Copy Original
                </Button>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(parsedJson, null, indentation))}
                  disabled={!parsedJson}
                >
                  Copy Formatted
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
