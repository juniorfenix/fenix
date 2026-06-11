export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      alimentos_padrao: {
        Row: {
          ativo: boolean | null;
          calorias: number;
          carboidratos: number;
          categoria: string | null;
          created_at: string | null;
          gorduras: number;
          icone: string | null;
          id: string;
          nome: string;
          ordem: number | null;
          porcao_referencia_g: number | null;
          proteinas: number;
        };
        Insert: {
          ativo?: boolean | null;
          calorias?: number;
          carboidratos?: number;
          categoria?: string | null;
          created_at?: string | null;
          gorduras?: number;
          icone?: string | null;
          id?: string;
          nome: string;
          ordem?: number | null;
          porcao_referencia_g?: number | null;
          proteinas?: number;
        };
        Update: {
          ativo?: boolean | null;
          calorias?: number;
          carboidratos?: number;
          categoria?: string | null;
          created_at?: string | null;
          gorduras?: number;
          icone?: string | null;
          id?: string;
          nome?: string;
          ordem?: number | null;
          porcao_referencia_g?: number | null;
          proteinas?: number;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          badge_type: string;
          earned_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          badge_type: string;
          earned_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          badge_type?: string;
          earned_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      cardapios: {
        Row: {
          calorias: number;
          carboidratos: number;
          created_at: string | null;
          descricao: string;
          genero: string;
          gorduras: number;
          horario: string | null;
          id: string;
          objetivo: string;
          opcao_nome: string;
          opcao_numero: number;
          ordem: number;
          proteinas: number;
          refeicao: string;
        };
        Insert: {
          calorias?: number;
          carboidratos?: number;
          created_at?: string | null;
          descricao?: string;
          genero: string;
          gorduras?: number;
          horario?: string | null;
          id?: string;
          objetivo: string;
          opcao_nome?: string;
          opcao_numero?: number;
          ordem?: number;
          proteinas?: number;
          refeicao: string;
        };
        Update: {
          calorias?: number;
          carboidratos?: number;
          created_at?: string | null;
          descricao?: string;
          genero?: string;
          gorduras?: number;
          horario?: string | null;
          id?: string;
          objetivo?: string;
          opcao_nome?: string;
          opcao_numero?: number;
          ordem?: number;
          proteinas?: number;
          refeicao?: string;
        };
        Relationships: [];
      };
      diario_alimentar: {
        Row: {
          calorias: number;
          carboidratos: number;
          created_at: string | null;
          data: string;
          gorduras: number;
          id: string;
          nome: string;
          observacoes: string | null;
          proteinas: number;
          refeicao: string | null;
          user_id: string;
        };
        Insert: {
          calorias?: number;
          carboidratos?: number;
          created_at?: string | null;
          data: string;
          gorduras?: number;
          id?: string;
          nome: string;
          observacoes?: string | null;
          proteinas?: number;
          refeicao?: string | null;
          user_id: string;
        };
        Update: {
          calorias?: number;
          carboidratos?: number;
          created_at?: string | null;
          data?: string;
          gorduras?: number;
          id?: string;
          nome?: string;
          observacoes?: string | null;
          proteinas?: number;
          refeicao?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      diario_registro: {
        Row: {
          created_at: string | null;
          humor: string | null;
          id: string;
          pergunta: string;
          registrado_em: string;
          resposta: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          humor?: string | null;
          id?: string;
          pergunta: string;
          registrado_em: string;
          resposta?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          humor?: string | null;
          id?: string;
          pergunta?: string;
          registrado_em?: string;
          resposta?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      dietas: {
        Row: {
          categoria: string;
          created_at: string | null;
          descricao: string;
          fase: string | null;
          genero: string;
          horario: string | null;
          id: string;
          kcal: number;
          opcao: number;
          ordem: number;
          proteina_g: number;
          refeicao: string;
        };
        Insert: {
          categoria: string;
          created_at?: string | null;
          descricao: string;
          fase?: string | null;
          genero: string;
          horario?: string | null;
          id?: string;
          kcal?: number;
          opcao?: number;
          ordem?: number;
          proteina_g?: number;
          refeicao: string;
        };
        Update: {
          categoria?: string;
          created_at?: string | null;
          descricao?: string;
          fase?: string | null;
          genero?: string;
          horario?: string | null;
          id?: string;
          kcal?: number;
          opcao?: number;
          ordem?: number;
          proteina_g?: number;
          refeicao?: string;
        };
        Relationships: [];
      };
      dietas_dicas: {
        Row: {
          created_at: string | null;
          dica: string;
          genero: string;
          id: string;
          ordem: number;
        };
        Insert: {
          created_at?: string | null;
          dica: string;
          genero: string;
          id?: string;
          ordem?: number;
        };
        Update: {
          created_at?: string | null;
          dica?: string;
          genero?: string;
          id?: string;
          ordem?: number;
        };
        Relationships: [];
      };
      exercicios: {
        Row: {
          created_at: string;
          descricao: string | null;
          equipamento: string;
          gif_url: string | null;
          grupo_muscular: string | null;
          id: number;
          nivel: string;
          nome: string;
          tipo_midia: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string;
          descricao?: string | null;
          equipamento?: string;
          gif_url?: string | null;
          grupo_muscular?: string | null;
          id?: number;
          nivel?: string;
          nome?: string;
          tipo_midia?: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string;
          descricao?: string | null;
          equipamento?: string;
          gif_url?: string | null;
          grupo_muscular?: string | null;
          id?: number;
          nivel?: string;
          nome?: string;
          tipo_midia?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      guias_mentais: {
        Row: {
          chave: string;
          conteudo: string;
          created_at: string | null;
          descricao: string | null;
          id: string;
          ordem: number;
          titulo: string;
        };
        Insert: {
          chave: string;
          conteudo?: string;
          created_at?: string | null;
          descricao?: string | null;
          id?: string;
          ordem?: number;
          titulo: string;
        };
        Update: {
          chave?: string;
          conteudo?: string;
          created_at?: string | null;
          descricao?: string | null;
          id?: string;
          ordem?: number;
          titulo?: string;
        };
        Relationships: [];
      };
      hidratacao_diaria: {
        Row: {
          copos: number;
          created_at: string | null;
          data: string;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          copos?: number;
          created_at?: string | null;
          data?: string;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          copos?: number;
          created_at?: string | null;
          data?: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      instrutores_alunos: {
        Row: {
          aluno_id: string;
          created_at: string | null;
          id: string;
          instrutor_id: string;
        };
        Insert: {
          aluno_id: string;
          created_at?: string | null;
          id?: string;
          instrutor_id: string;
        };
        Update: {
          aluno_id?: string;
          created_at?: string | null;
          id?: string;
          instrutor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "instrutores_alunos_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instrutores_alunos_instrutor_id_fkey";
            columns: ["instrutor_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
        ];
      };
      metas_usuario: {
        Row: {
          created_at: string | null;
          id: string;
          objetivo_ativo: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          objetivo_ativo?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          objetivo_ativo?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notificacoes_instrutor: {
        Row: {
          aluno_id: string;
          corpo: string | null;
          created_at: string;
          data_ref: string | null;
          id: string;
          instrutor_id: string;
          lida: boolean;
          plano_id: string | null;
          tipo: string;
          titulo: string;
        };
        Insert: {
          aluno_id: string;
          corpo?: string | null;
          created_at?: string;
          data_ref?: string | null;
          id?: string;
          instrutor_id: string;
          lida?: boolean;
          plano_id?: string | null;
          tipo: string;
          titulo: string;
        };
        Update: {
          aluno_id?: string;
          corpo?: string | null;
          created_at?: string;
          data_ref?: string | null;
          id?: string;
          instrutor_id?: string;
          lida?: boolean;
          plano_id?: string | null;
          tipo?: string;
          titulo?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notificacoes_instrutor_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notificacoes_instrutor_instrutor_id_fkey";
            columns: ["instrutor_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
        ];
      };
      perfis: {
        Row: {
          created_at: string;
          id: string;
          nome: string | null;
          papel: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          nome?: string | null;
          papel?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          nome?: string | null;
          papel?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      planner_semanal: {
        Row: {
          created_at: string | null;
          dados: Json;
          id: string;
          semana_iso: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          dados?: Json;
          id?: string;
          semana_iso: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          dados?: Json;
          id?: string;
          semana_iso?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      plano_alimentar_adesao: {
        Row: {
          id: string;
          plano_id: string;
          aluno_id: string;
          data: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          plano_id: string;
          aluno_id: string;
          data?: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          plano_id?: string;
          aluno_id?: string;
          data?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "plano_alimentar_adesao_plano_id_fkey";
            columns: ["plano_id"];
            isOneToOne: false;
            referencedRelation: "planos_alimentares";
            referencedColumns: ["id"];
          },
        ];
      };
      plano_alimentar_refeicoes: {
        Row: {
          created_at: string | null;
          descricao: string;
          horario: string | null;
          id: string;
          kcal: number | null;
          observacoes: string | null;
          ordem: number;
          plano_id: string;
          proteina_g: number | null;
          refeicao: string;
        };
        Insert: {
          created_at?: string | null;
          descricao: string;
          horario?: string | null;
          id?: string;
          kcal?: number | null;
          observacoes?: string | null;
          ordem?: number;
          plano_id: string;
          proteina_g?: number | null;
          refeicao: string;
        };
        Update: {
          created_at?: string | null;
          descricao?: string;
          horario?: string | null;
          id?: string;
          kcal?: number | null;
          observacoes?: string | null;
          ordem?: number;
          plano_id?: string;
          proteina_g?: number | null;
          refeicao?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plano_alimentar_refeicoes_plano_id_fkey";
            columns: ["plano_id"];
            isOneToOne: false;
            referencedRelation: "planos_alimentares";
            referencedColumns: ["id"];
          },
        ];
      };
      plano_treino_conclusoes: {
        Row: {
          id: string;
          plano_id: string;
          aluno_id: string;
          dia_semana: number;
          data: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          plano_id: string;
          aluno_id: string;
          dia_semana: number;
          data?: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          plano_id?: string;
          aluno_id?: string;
          dia_semana?: number;
          data?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "plano_treino_conclusoes_plano_id_fkey";
            columns: ["plano_id"];
            isOneToOne: false;
            referencedRelation: "planos_treino";
            referencedColumns: ["id"];
          },
        ];
      };
      planos_alimentares: {
        Row: {
          aluno_id: string;
          ativo: boolean;
          created_at: string | null;
          descricao: string | null;
          id: string;
          instrutor_id: string;
          meta_carboidratos_g: number | null;
          meta_gorduras_g: number | null;
          meta_kcal: number | null;
          meta_proteinas_g: number | null;
          nome: string;
          updated_at: string | null;
        };
        Insert: {
          aluno_id: string;
          ativo?: boolean;
          created_at?: string | null;
          descricao?: string | null;
          id?: string;
          instrutor_id: string;
          meta_carboidratos_g?: number | null;
          meta_gorduras_g?: number | null;
          meta_kcal?: number | null;
          meta_proteinas_g?: number | null;
          nome: string;
          updated_at?: string | null;
        };
        Update: {
          aluno_id?: string;
          ativo?: boolean;
          created_at?: string | null;
          descricao?: string | null;
          id?: string;
          instrutor_id?: string;
          meta_carboidratos_g?: number | null;
          meta_gorduras_g?: number | null;
          meta_kcal?: number | null;
          meta_proteinas_g?: number | null;
          nome?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "planos_alimentares_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planos_alimentares_instrutor_id_fkey";
            columns: ["instrutor_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
        ];
      };
      planos_treino: {
        Row: {
          aluno_id: string;
          ativo: boolean;
          created_at: string | null;
          dias_semana: string[] | null;
          id: string;
          instrutor_id: string;
          nivel: string;
          nome: string;
          updated_at: string | null;
        };
        Insert: {
          aluno_id: string;
          ativo?: boolean;
          created_at?: string | null;
          dias_semana?: string[] | null;
          id?: string;
          instrutor_id: string;
          nivel?: string;
          nome: string;
          updated_at?: string | null;
        };
        Update: {
          aluno_id?: string;
          ativo?: boolean;
          created_at?: string | null;
          dias_semana?: string[] | null;
          id?: string;
          instrutor_id?: string;
          nivel?: string;
          nome?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "planos_treino_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planos_treino_instrutor_id_fkey";
            columns: ["instrutor_id"];
            isOneToOne: false;
            referencedRelation: "perfis";
            referencedColumns: ["id"];
          },
        ];
      };
      planos_treino_exercicios: {
        Row: {
          created_at: string | null;
          descanso_seg: number;
          dia_semana: number;
          exercicio_id: number;
          id: string;
          observacoes: string | null;
          ordem: number;
          plano_id: string;
          repeticoes: string;
          series: number;
        };
        Insert: {
          created_at?: string | null;
          descanso_seg?: number;
          dia_semana: number;
          exercicio_id: number;
          id?: string;
          observacoes?: string | null;
          ordem?: number;
          plano_id: string;
          repeticoes?: string;
          series?: number;
        };
        Update: {
          created_at?: string | null;
          descanso_seg?: number;
          dia_semana?: number;
          exercicio_id?: number;
          id?: string;
          observacoes?: string | null;
          ordem?: number;
          plano_id?: string;
          repeticoes?: string;
          series?: number;
        };
        Relationships: [
          {
            foreignKeyName: "planos_treino_exercicios_exercicio_id_fkey";
            columns: ["exercicio_id"];
            isOneToOne: false;
            referencedRelation: "exercicios";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planos_treino_exercicios_plano_id_fkey";
            columns: ["plano_id"];
            isOneToOne: false;
            referencedRelation: "planos_treino";
            referencedColumns: ["id"];
          },
        ];
      };
      preferencias_alimentares: {
        Row: {
          created_at: string | null;
          detestados: string[] | null;
          essenciais: string[] | null;
          estilo_refeicao: string | null;
          id: string;
          restricoes: string[] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          detestados?: string[] | null;
          essenciais?: string[] | null;
          estilo_refeicao?: string | null;
          id?: string;
          restricoes?: string[] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          detestados?: string[] | null;
          essenciais?: string[] | null;
          estilo_refeicao?: string | null;
          id?: string;
          restricoes?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          activity_level: string | null;
          age: number | null;
          alimento_favorito: string | null;
          alimentos_evitar: string[] | null;
          created_at: string | null;
          current_weight: number | null;
          daily_calorie_goal: number | null;
          display_name: string | null;
          email: string | null;
          gender: string | null;
          goal_weight: number | null;
          has_seen_welcome: boolean;
          height: number | null;
          id: string;
          objetivo_fenix: string | null;
          onboarding_complete: boolean;
          restricao_descricao: string | null;
          tem_restricao: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          activity_level?: string | null;
          age?: number | null;
          alimento_favorito?: string | null;
          alimentos_evitar?: string[] | null;
          created_at?: string | null;
          current_weight?: number | null;
          daily_calorie_goal?: number | null;
          display_name?: string | null;
          email?: string | null;
          gender?: string | null;
          goal_weight?: number | null;
          has_seen_welcome?: boolean;
          height?: number | null;
          id: string;
          objetivo_fenix?: string | null;
          onboarding_complete?: boolean;
          restricao_descricao?: string | null;
          tem_restricao?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          activity_level?: string | null;
          age?: number | null;
          alimento_favorito?: string | null;
          alimentos_evitar?: string[] | null;
          created_at?: string | null;
          current_weight?: number | null;
          daily_calorie_goal?: number | null;
          display_name?: string | null;
          email?: string | null;
          gender?: string | null;
          goal_weight?: number | null;
          has_seen_welcome?: boolean;
          height?: number | null;
          id?: string;
          objetivo_fenix?: string | null;
          onboarding_complete?: boolean;
          restricao_descricao?: string | null;
          tem_restricao?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      protocolo_itens: {
        Row: {
          alimento_id: string;
          created_at: string | null;
          gramas: number;
          id: string;
          ordem: number;
          protocolo_id: string;
          refeicao: string;
        };
        Insert: {
          alimento_id: string;
          created_at?: string | null;
          gramas?: number;
          id?: string;
          ordem?: number;
          protocolo_id: string;
          refeicao: string;
        };
        Update: {
          alimento_id?: string;
          created_at?: string | null;
          gramas?: number;
          id?: string;
          ordem?: number;
          protocolo_id?: string;
          refeicao?: string;
        };
        Relationships: [
          {
            foreignKeyName: "protocolo_itens_alimento_id_fkey";
            columns: ["alimento_id"];
            isOneToOne: false;
            referencedRelation: "alimentos_padrao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "protocolo_itens_protocolo_id_fkey";
            columns: ["protocolo_id"];
            isOneToOne: false;
            referencedRelation: "protocolos_prescritos";
            referencedColumns: ["id"];
          },
        ];
      };
      protocolos_prescritos: {
        Row: {
          created_at: string | null;
          id: string;
          meta_carboidratos: number;
          meta_gorduras: number;
          meta_kcal: number;
          meta_proteinas: number;
          observacoes: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          meta_carboidratos?: number;
          meta_gorduras?: number;
          meta_kcal?: number;
          meta_proteinas?: number;
          observacoes?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          meta_carboidratos?: number;
          meta_gorduras?: number;
          meta_kcal?: number;
          meta_proteinas?: number;
          observacoes?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      substituicoes_log: {
        Row: {
          alimento_original_id: string | null;
          alimento_original_nome: string;
          alimento_substituto_id: string | null;
          alimento_substituto_nome: string;
          created_at: string | null;
          delta_carboidratos_pct: number | null;
          delta_gorduras_pct: number | null;
          delta_proteinas_pct: number | null;
          gramas_original: number;
          gramas_substituto: number;
          id: string;
          protocolo_item_id: string | null;
          refeicao: string;
          user_id: string;
        };
        Insert: {
          alimento_original_id?: string | null;
          alimento_original_nome: string;
          alimento_substituto_id?: string | null;
          alimento_substituto_nome: string;
          created_at?: string | null;
          delta_carboidratos_pct?: number | null;
          delta_gorduras_pct?: number | null;
          delta_proteinas_pct?: number | null;
          gramas_original?: number;
          gramas_substituto: number;
          id?: string;
          protocolo_item_id?: string | null;
          refeicao: string;
          user_id: string;
        };
        Update: {
          alimento_original_id?: string | null;
          alimento_original_nome?: string;
          alimento_substituto_id?: string | null;
          alimento_substituto_nome?: string;
          created_at?: string | null;
          delta_carboidratos_pct?: number | null;
          delta_gorduras_pct?: number | null;
          delta_proteinas_pct?: number | null;
          gramas_original?: number;
          gramas_substituto?: number;
          id?: string;
          protocolo_item_id?: string | null;
          refeicao?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      treinos: {
        Row: {
          created_at: string | null;
          dia_semana: number;
          dica_seguranca: string | null;
          exercicio: string;
          genero: string;
          id: string;
          instrucao: string | null;
          local: string;
          nivel: string;
          observacoes: string | null;
          ordem: number;
          series_repeticoes: string;
          url_midia: string | null;
        };
        Insert: {
          created_at?: string | null;
          dia_semana: number;
          dica_seguranca?: string | null;
          exercicio: string;
          genero: string;
          id?: string;
          instrucao?: string | null;
          local: string;
          nivel: string;
          observacoes?: string | null;
          ordem?: number;
          series_repeticoes: string;
          url_midia?: string | null;
        };
        Update: {
          created_at?: string | null;
          dia_semana?: number;
          dica_seguranca?: string | null;
          exercicio?: string;
          genero?: string;
          id?: string;
          instrucao?: string | null;
          local?: string;
          nivel?: string;
          observacoes?: string | null;
          ordem?: number;
          series_repeticoes?: string;
          url_midia?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      weight_logs: {
        Row: {
          created_at: string | null;
          id: string;
          logged_date: string;
          user_id: string;
          weight: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          logged_date: string;
          user_id: string;
          weight: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          logged_date?: string;
          user_id?: string;
          weight?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
