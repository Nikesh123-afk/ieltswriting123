'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ScoringResults from '@/components/ScoringResults'

interface EssayData {
  id: string
  taskType: string
  module: string
  prompt: string
  essay: string
  wordCount: number
  submittedAt: string
  result: any
}

export default function EssayDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [essay, setEssay] = useState<EssayData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    
    if (status === 'authenticated' && params?.id) {
      fetchEssay()
    }
  }, [status, params, router])

  const fetchEssay = async () => {
    try {
      const res = await fetch(`/api/essays/${params?.id}`)
      if (res.ok) {
        const data = await res.json()
        setEssay(data.essay)
      } else if (res.status === 404) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch essay:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] via-[#fef5ee] to-[#fcf4ed] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!essay) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] via-[#fef5ee] to-[#fcf4ed]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 academic-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-600">
              Submitted {formatDate(essay.submittedAt)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Essay Info */}
        <div className="bg-white rounded-2xl border border-gray-100 academic-shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              {essay.module === 'academic' ? 'Academic' : 'General'} - Task {essay.taskType.slice(-1)}
            </span>
            <span className="text-sm text-gray-500">{essay.wordCount} words</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Prompt</h3>
              <p className="text-base text-gray-900 leading-relaxed">{essay.prompt}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Essay</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">{essay.essay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {essay.result && (
          <ScoringResults
            result={{
              success: true,
              data: {
                overallBand: essay.result.overallBand,
                criteriaScores: {
                  taskAchievement: essay.result.taskAchievement,
                  taskResponse: essay.result.taskAchievement,
                  coherenceCohesion: essay.result.coherenceCohesion,
                  lexicalResource: essay.result.lexicalResource,
                  grammaticalRangeAccuracy: essay.result.grammaticalRange,
                },
                executiveSummary: essay.result.executiveSummary,
                criteriaFeedback: essay.result.criteriaFeedback,
                highlightedIssues: essay.result.highlightedIssues,
                revisionPlan: essay.result.revisionPlan,
                educatorNotes: essay.result.educatorNotes,
              },
            }}
          />
        )}
      </main>
    </div>
  )
}
