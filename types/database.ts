export type Plan = "starter" | "business" | "enterprise";
export type Market = "africa" | "europe";
export type OrgStatus = "active" | "suspended" | "trial";
export type UserRole = "owner" | "admin" | "member";
export type ConversationStatus = "open" | "escalated" | "closed";
export type Satisfaction = "positive" | "neutral" | "negative" | null;
export type MessageRole = "user" | "assistant";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  market: Market;
  status: OrgStatus;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Agent {
  id: string;
  organization_id: string;
  name: string;
  shop_name: string;
  system_prompt: string;
  welcome_message: string;
  primary_color: string;
  is_active: boolean;
  widget_token: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  organization_id: string;
  visitor_id: string | null;
  status: ConversationStatus;
  satisfaction: Satisfaction;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
