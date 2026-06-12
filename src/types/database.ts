export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface SavedCard {
  id: string;
  user_id: string;
  name: string;
  template_id: string;
  card_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  source: "manual" | "card_share" | "import";
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  contact_id: string;
  user_id: string;
  type: "note" | "call" | "email" | "meeting";
  content: string;
  created_at: string;
}
