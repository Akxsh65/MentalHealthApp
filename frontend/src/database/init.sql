-- Create clinicians table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinicians (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own clinician data" ON clinicians;
DROP POLICY IF EXISTS "Users can update own clinician data" ON clinicians;
DROP POLICY IF EXISTS "Users can insert own clinician data" ON clinicians;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON clinicians;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can view own clinician data" ON clinicians
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to update their own data
CREATE POLICY "Users can update own clinician data" ON clinicians
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to insert their own data
CREATE POLICY "Enable insert for authenticated users only" ON clinicians
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically set display_name
CREATE OR REPLACE FUNCTION set_clinician_display_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.display_name = COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.first_name, NEW.last_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_clinician_display_name_trigger ON clinicians;

-- Trigger to automatically set display_name before insert or update
CREATE TRIGGER set_clinician_display_name_trigger
    BEFORE INSERT OR UPDATE ON clinicians
    FOR EACH ROW
    EXECUTE FUNCTION set_clinician_display_name(); 