import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mb-8">
          Bienvenue, {session.user.email}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700">Agents actifs</h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700">Conversations</h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700">Satisfaction</h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">—</p>
          </div>
        </div>
      </div>
    </div>
  )
}
