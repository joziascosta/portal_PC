export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      banners_home: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string
          link_url: string | null
          ordem: number
          subtitulo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url: string
          link_url?: string | null
          ordem?: number
          subtitulo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          link_url?: string | null
          ordem?: number
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      documentos_transparencia: {
        Row: {
          ano: number
          arquivo_url: string | null
          categoria: string
          created_at: string
          data_publicacao: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano: number
          arquivo_url?: string | null
          categoria: string
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          arquivo_url?: string | null
          categoria?: string
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      leis: {
        Row: {
          ano: number
          arquivo_url: string | null
          created_at: string
          data_publicacao: string
          ementa: string
          id: string
          numero: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ano: number
          arquivo_url?: string | null
          created_at?: string
          data_publicacao?: string
          ementa: string
          id?: string
          numero: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ano?: number
          arquivo_url?: string | null
          created_at?: string
          data_publicacao?: string
          ementa?: string
          id?: string
          numero?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      licitacoes: {
        Row: {
          arquivo_url: string | null
          created_at: string
          data_abertura: string | null
          id: string
          modalidade: string
          numero: string
          objeto: string
          status: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          data_abertura?: string | null
          id?: string
          modalidade: string
          numero: string
          objeto: string
          status?: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          data_abertura?: string | null
          id?: string
          modalidade?: string
          numero?: string
          objeto?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          autor_id: string | null
          conteudo: string
          created_at: string
          data_publicacao: string
          id: string
          imagem_url: string | null
          publicada: boolean
          resumo: string | null
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          conteudo: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_url?: string | null
          publicada?: boolean
          resumo?: string | null
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          conteudo?: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_url?: string | null
          publicada?: boolean
          resumo?: string | null
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      paginas_institucionais: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          ordem: number
          publicado: boolean
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          id?: string
          ordem?: number
          publicado?: boolean
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          ordem?: number
          publicado?: boolean
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projetos_lei: {
        Row: {
          ano: number
          arquivo_url: string | null
          autor: string | null
          created_at: string
          data_apresentacao: string | null
          ementa: string
          id: string
          numero: string
          status: string
          updated_at: string
        }
        Insert: {
          ano: number
          arquivo_url?: string | null
          autor?: string | null
          created_at?: string
          data_apresentacao?: string | null
          ementa: string
          id?: string
          numero: string
          status?: string
          updated_at?: string
        }
        Update: {
          ano?: number
          arquivo_url?: string | null
          autor?: string | null
          created_at?: string
          data_apresentacao?: string | null
          ementa?: string
          id?: string
          numero?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      publicacoes_oficiais: {
        Row: {
          arquivo_url: string | null
          created_at: string
          data_publicacao: string
          descricao: string | null
          id: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          chave: string
          updated_at: string
          valor: Json
        }
        Insert: {
          chave: string
          updated_at?: string
          valor?: Json
        }
        Update: {
          chave?: string
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vereadores: {
        Row: {
          ativo: boolean
          biografia: string | null
          cargo: string
          created_at: string
          email: string | null
          foto_url: string | null
          id: string
          nome: string
          ordem: number
          partido: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          biografia?: string | null
          cargo?: string
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number
          partido?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          biografia?: string | null
          cargo?: string
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number
          partido?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
