import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 瀏覽器端客戶端
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// 伺服器端客戶端（用於 Server Actions）
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// 型別定義
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'designer' | 'contractor' | 'client'
          company_id: string | null
          phone: string | null
          line_user_id: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      companies: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          line_channel_id: string | null
          line_channel_secret: string | null
          notion_database_id: string | null
          notion_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['companies']['Row']>
      }
      projects: {
        Row: {
          id: string
          company_id: string
          project_number: string
          name: string
          description: string | null
          client_name: string
          client_phone: string | null
          client_email: string | null
          client_line_id: string | null
          address: string | null
          location_notes: string | null
          inspection_date: string | null
          designer_id: string | null
          status: 'planning' | 'in_progress' | 'completed' | 'signed'
          completion_rate: number
          notion_page_id: string | null
          notion_last_sync: string | null
          designer_signature_id: string | null
          client_signature_id: string | null
          latest_report_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at' | 'completion_rate'>
        Update: Partial<Database['public']['Tables']['projects']['Row']>
      }
      defects: {
        Row: {
          id: string
          project_id: string
          item_id: string | null
          title: string
          description: string | null
          location: string | null
          severity: 'minor' | 'normal' | 'critical'
          status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'overdue'
          is_overdue: boolean
          deadline: string | null
          contractor_id: string | null
          reported_by: string | null
          improvement_notes: string | null
          completed_at: string | null
          verified_at: string | null
          verified_by: string | null
          notion_item_id: string | null
          line_message_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['defects']['Row'], 'id' | 'created_at' | 'updated_at' | 'is_overdue'>
        Update: Partial<Database['public']['Tables']['defects']['Row']>
      }
      defect_photos: {
        Row: {
          id: string
          defect_id: string
          photo_url: string
          storage_path: string | null
          photo_type: 'before' | 'after' | 'progress'
          uploaded_by: string | null
          uploaded_at: string
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['defect_photos']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['defect_photos']['Row']>
      }
    }
  }
}
