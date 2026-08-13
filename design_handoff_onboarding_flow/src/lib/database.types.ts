export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      ambassadors: {
        Row: {
          brand_id: string;
          contact: string | null;
          created_at: string;
          handle: string | null;
          id: string;
          joined_at: string;
          level: Database["public"]["Enums"]["ambassador_level"];
          name: string;
          status: Database["public"]["Enums"]["ambassador_status"];
        };
        Insert: {
          brand_id: string;
          contact?: string | null;
          created_at?: string;
          handle?: string | null;
          id?: string;
          joined_at?: string;
          level?: Database["public"]["Enums"]["ambassador_level"];
          name: string;
          status?: Database["public"]["Enums"]["ambassador_status"];
        };
        Update: {
          brand_id?: string;
          contact?: string | null;
          created_at?: string;
          handle?: string | null;
          id?: string;
          joined_at?: string;
          level?: Database["public"]["Enums"]["ambassador_level"];
          name?: string;
          status?: Database["public"]["Enums"]["ambassador_status"];
        };
        Relationships: [
          {
            foreignKeyName: "ambassadors_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          address_city: string | null;
          address_complement: string | null;
          address_neighborhood: string | null;
          address_number: string | null;
          address_state: string | null;
          address_street: string | null;
          address_zip: string | null;
          billing_email: string | null;
          billing_phone: string | null;
          cnpj: string | null;
          created_at: string;
          id: string;
          instagram_handle: string | null;
          legal_name: string | null;
          legal_rep_name: string | null;
          legal_rep_role: string | null;
          logo_url: string | null;
          name: string;
          subscription_status: string;
          subscription_tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at: string;
        };
        Insert: {
          address_city?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip?: string | null;
          billing_email?: string | null;
          billing_phone?: string | null;
          cnpj?: string | null;
          created_at?: string;
          id?: string;
          instagram_handle?: string | null;
          legal_name?: string | null;
          legal_rep_name?: string | null;
          legal_rep_role?: string | null;
          logo_url?: string | null;
          name: string;
          subscription_status?: string;
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string;
        };
        Update: {
          address_city?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_number?: string | null;
          address_state?: string | null;
          address_street?: string | null;
          address_zip?: string | null;
          billing_email?: string | null;
          billing_phone?: string | null;
          cnpj?: string | null;
          created_at?: string;
          id?: string;
          instagram_handle?: string | null;
          legal_name?: string | null;
          legal_rep_name?: string | null;
          legal_rep_role?: string | null;
          logo_url?: string | null;
          name?: string;
          subscription_status?: string;
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string;
        };
        Relationships: [];
      };
      content_posts: {
        Row: {
          ambassador_id: string;
          approval_status: Database["public"]["Enums"]["approval_status"];
          brand_id: string;
          checklist_coupon_visible: boolean;
          checklist_mentioned_brand: boolean;
          checklist_min_days_live: boolean;
          content_type: Database["public"]["Enums"]["content_type"];
          created_at: string;
          credit_generated: number;
          id: string;
          last_checked_at: string | null;
          link: string | null;
          publish_date: string;
          still_live: boolean;
        };
        Insert: {
          ambassador_id: string;
          approval_status?: Database["public"]["Enums"]["approval_status"];
          brand_id: string;
          checklist_coupon_visible?: boolean;
          checklist_mentioned_brand?: boolean;
          checklist_min_days_live?: boolean;
          content_type: Database["public"]["Enums"]["content_type"];
          created_at?: string;
          credit_generated?: number;
          id?: string;
          last_checked_at?: string | null;
          link?: string | null;
          publish_date?: string;
          still_live?: boolean;
        };
        Update: {
          ambassador_id?: string;
          approval_status?: Database["public"]["Enums"]["approval_status"];
          brand_id?: string;
          checklist_coupon_visible?: boolean;
          checklist_mentioned_brand?: boolean;
          checklist_min_days_live?: boolean;
          content_type?: Database["public"]["Enums"]["content_type"];
          created_at?: string;
          credit_generated?: number;
          id?: string;
          last_checked_at?: string | null;
          link?: string | null;
          publish_date?: string;
          still_live?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "content_posts_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_posts_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_posts_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          ambassador_id: string;
          brand_id: string;
          code: string;
          created_at: string;
          id: string;
          shopify_shop_domain: string | null;
        };
        Insert: {
          ambassador_id: string;
          brand_id: string;
          code: string;
          created_at?: string;
          id?: string;
          shopify_shop_domain?: string | null;
        };
        Update: {
          ambassador_id?: string;
          brand_id?: string;
          code?: string;
          created_at?: string;
          id?: string;
          shopify_shop_domain?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "coupons_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coupons_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coupons_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_ledger: {
        Row: {
          ambassador_id: string;
          amount: number;
          brand_id: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          source: Database["public"]["Enums"]["credit_source"];
          source_content_id: string | null;
          source_sale_id: string | null;
          status: Database["public"]["Enums"]["ledger_status"];
        };
        Insert: {
          ambassador_id: string;
          amount: number;
          brand_id: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          source: Database["public"]["Enums"]["credit_source"];
          source_content_id?: string | null;
          source_sale_id?: string | null;
          status?: Database["public"]["Enums"]["ledger_status"];
        };
        Update: {
          ambassador_id?: string;
          amount?: number;
          brand_id?: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          source?: Database["public"]["Enums"]["credit_source"];
          source_content_id?: string | null;
          source_sale_id?: string | null;
          status?: Database["public"]["Enums"]["ledger_status"];
        };
        Relationships: [
          {
            foreignKeyName: "credit_ledger_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_ledger_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_ledger_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_ledger_source_content_id_fkey";
            columns: ["source_content_id"];
            isOneToOne: false;
            referencedRelation: "content_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_ledger_source_sale_id_fkey";
            columns: ["source_sale_id"];
            isOneToOne: false;
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_rules: {
        Row: {
          activation_window_days: number;
          brand_id: string;
          content_monthly_cap: number;
          credit_validity_days: number;
          id: string;
          min_redemption_amount: number;
          performance_tiers: Json;
          post_credit_value: number;
          post_monthly_limit: number;
          score_consistency_bonus: number;
          score_weight_content: number;
          score_weight_sale: number;
          story_credit_value: number;
          story_monthly_limit: number;
          updated_at: string;
        };
        Insert: {
          activation_window_days?: number;
          brand_id: string;
          content_monthly_cap?: number;
          credit_validity_days?: number;
          id?: string;
          min_redemption_amount?: number;
          performance_tiers?: Json;
          post_credit_value?: number;
          post_monthly_limit?: number;
          score_consistency_bonus?: number;
          score_weight_content?: number;
          score_weight_sale?: number;
          story_credit_value?: number;
          story_monthly_limit?: number;
          updated_at?: string;
        };
        Update: {
          activation_window_days?: number;
          brand_id?: string;
          content_monthly_cap?: number;
          credit_validity_days?: number;
          id?: string;
          min_redemption_amount?: number;
          performance_tiers?: Json;
          post_credit_value?: number;
          post_monthly_limit?: number;
          score_consistency_bonus?: number;
          score_weight_content?: number;
          score_weight_sale?: number;
          story_credit_value?: number;
          story_monthly_limit?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "credit_rules_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: true;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          ambassador_id: string | null;
          brand_id: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          ambassador_id?: string | null;
          brand_id?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          ambassador_id?: string | null;
          brand_id?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [
          {
            foreignKeyName: "profiles_ambassador_fk";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_ambassador_fk";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      redemptions: {
        Row: {
          ambassador_id: string;
          amount_deducted: number;
          brand_id: string;
          created_at: string;
          id: string;
          item_redeemed: string;
          production_cost: number | null;
          redeemed_at: string;
          shipping_address: string | null;
          status: Database["public"]["Enums"]["redemption_status"];
          variant: string | null;
        };
        Insert: {
          ambassador_id: string;
          amount_deducted: number;
          brand_id: string;
          created_at?: string;
          id?: string;
          item_redeemed: string;
          production_cost?: number | null;
          redeemed_at?: string;
          shipping_address?: string | null;
          status?: Database["public"]["Enums"]["redemption_status"];
          variant?: string | null;
        };
        Update: {
          ambassador_id?: string;
          amount_deducted?: number;
          brand_id?: string;
          created_at?: string;
          id?: string;
          item_redeemed?: string;
          production_cost?: number | null;
          redeemed_at?: string;
          shipping_address?: string | null;
          status?: Database["public"]["Enums"]["redemption_status"];
          variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "redemptions_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "redemptions_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "redemptions_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          ambassador_id: string;
          brand_id: string;
          coupon_id: string;
          created_at: string;
          credit_generated: number;
          id: string;
          order_amount: number;
          sale_date: string;
        };
        Insert: {
          ambassador_id: string;
          brand_id: string;
          coupon_id: string;
          created_at?: string;
          credit_generated?: number;
          id?: string;
          order_amount: number;
          sale_date?: string;
        };
        Update: {
          ambassador_id?: string;
          brand_id?: string;
          coupon_id?: string;
          created_at?: string;
          credit_generated?: number;
          id?: string;
          order_amount?: number;
          sale_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sales_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassador_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_ambassador_id_fkey";
            columns: ["ambassador_id"];
            isOneToOne: false;
            referencedRelation: "ambassadors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      ambassador_stats: {
        Row: {
          brand_id: string | null;
          contact: string | null;
          content_approved_30d: number | null;
          credit_balance: number | null;
          gmv_30d: number | null;
          handle: string | null;
          id: string | null;
          joined_at: string | null;
          level: Database["public"]["Enums"]["ambassador_level"] | null;
          name: string | null;
          sales_count_30d: number | null;
          score: number | null;
          status: Database["public"]["Enums"]["ambassador_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "ambassadors_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      current_ambassador_id: { Args: Record<string, never>; Returns: string };
      current_brand_id: { Args: Record<string, never>; Returns: string };
      current_role_type: { Args: Record<string, never>; Returns: Database["public"]["Enums"]["app_role"] };
    };
    Enums: {
      ambassador_level: "nano" | "micro" | "macro";
      ambassador_status: "active" | "inactive";
      app_role: "brand_admin" | "ambassador";
      approval_status: "pending" | "approved" | "rejected";
      content_type: "story" | "post" | "reels";
      credit_source: "sale" | "content";
      ledger_status: "active" | "expired" | "redeemed";
      redemption_status: "solicitado" | "enviado" | "recusado";
      subscription_tier: "starter" | "growth" | "scale";
    };
    CompositeTypes: Record<string, never>;
  };
};
