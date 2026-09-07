import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gwbmnpjtdhoqwjiiozmd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Ym1ucGp0ZGhvcXdqaWlvem1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTczMTksImV4cCI6MjEwNDI3MzMxOX0.RnTRYSzIkhqRpvXVRPy8R4HtVSWXVpJEe2tRgO_MEL8'

export const supabase = createClient(supabaseUrl, supabaseKey)
