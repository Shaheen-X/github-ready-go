-- Create connection status enum
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create connections table
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id),
  CHECK (requester_id != receiver_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Users can view connections where they are involved
CREATE POLICY "Users can view their connections"
ON public.connections
FOR SELECT
USING (
  auth.uid() = requester_id OR auth.uid() = receiver_id
);

-- Users can send connection requests
CREATE POLICY "Users can send connection requests"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- Users can accept/reject received requests
CREATE POLICY "Users can update received requests"
ON public.connections
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Users can delete their own pending requests
CREATE POLICY "Users can delete their pending requests"
ON public.connections
FOR DELETE
USING (auth.uid() = requester_id AND status = 'pending');

-- Create updated_at trigger
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_connections_requester ON public.connections(requester_id);
CREATE INDEX idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX idx_connections_status ON public.connections(status);