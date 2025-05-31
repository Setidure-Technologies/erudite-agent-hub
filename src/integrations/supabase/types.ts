export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_logs: {
        Row: {
          agent_name: string
          created_at: string
          id: string
          input_data: Json | null
          response_data: Json | null
          user_id: string
        }
        Insert: {
          agent_name: string
          created_at?: string
          id?: string
          input_data?: Json | null
          response_data?: Json | null
          user_id: string
        }
        Update: {
          agent_name?: string
          created_at?: string
          id?: string
          input_data?: Json | null
          response_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      Profiles: {
        Row: {
          "academic stream chosen in class 12": string | null
          "cgpa during mba program": number | null
          created_at: string | null
          "current age of the student": number | null
          "date of birth in mm/dd/yyyy format": string | null
          "Desired job role or long-term career goal of the student":
            | string
            | null
          "did the student have any gaps in academic career": string | null
          "does the student have any prior work experience": string | null
          "domain or function at first organization": string | null
          "domain or function at second organization": string | null
          "domain or function at third organization": string | null
          "duration of academic gap in months": string | null
          "duration of work experience at first organization in months":
            | string
            | null
          "duration of work experience at second organization in months":
            | string
            | null
          "duration of work experience at third organization in months":
            | string
            | null
          "education board for class 10": string | null
          "education board for class 12": string | null
          email: string | null
          "First area of academic or professional specialization of the st":
            | string
            | null
          "gender of the student": string | null
          id: string
          "industry of the first organization": string | null
          "industry of the second organization": string | null
          "industry of the third organization": string | null
          "interpersonal or soft skills of the student": string | null
          "job title or designation at first organization": string | null
          "job title or designation at second organization": string | null
          "job title or designation at third organization": string | null
          "Languages the student can speak, understand, or is proficient i":
            | string
            | null
          name: string | null
          "name of the college attended for graduation": string | null
          "name of the first organization worked at": string | null
          "Name of the organization where the student completed their summ":
            | string
            | null
          "name of the school attended for class 10": string | null
          "name of the school attended for class 12": string | null
          "name of the second organization worked at": string | null
          "name of the third organization worked at": string | null
          "name of the university attended for graduation": string | null
          "percentage marks obtained during graduation": number | null
          "percentage marks scored in class 10": number | null
          "percentage marks scored in class 12": number | null
          "projects or research work done during mba": string | null
          resume_parsed_data: Json | null
          resume_url: string | null
          "Role or profile undertaken by the student during their summer i":
            | string
            | null
          Roll_Number: string | null
          "Second area of academic or professional specialization of the s":
            | string
            | null
          "specialization pursued during graduation": string | null
          "technical skills of the student": string | null
          "total work experience of the student in months": string | null
          "type of degree obtained during graduation": string | null
          user_id: string | null
          "year when class 10 was completed": number | null
          "year when class 12 was completed": number | null
          "year when graduation was completed": number | null
        }
        Insert: {
          "academic stream chosen in class 12"?: string | null
          "cgpa during mba program"?: number | null
          created_at?: string | null
          "current age of the student"?: number | null
          "date of birth in mm/dd/yyyy format"?: string | null
          "Desired job role or long-term career goal of the student"?:
            | string
            | null
          "did the student have any gaps in academic career"?: string | null
          "does the student have any prior work experience"?: string | null
          "domain or function at first organization"?: string | null
          "domain or function at second organization"?: string | null
          "domain or function at third organization"?: string | null
          "duration of academic gap in months"?: string | null
          "duration of work experience at first organization in months"?:
            | string
            | null
          "duration of work experience at second organization in months"?:
            | string
            | null
          "duration of work experience at third organization in months"?:
            | string
            | null
          "education board for class 10"?: string | null
          "education board for class 12"?: string | null
          email?: string | null
          "First area of academic or professional specialization of the st"?:
            | string
            | null
          "gender of the student"?: string | null
          id?: string
          "industry of the first organization"?: string | null
          "industry of the second organization"?: string | null
          "industry of the third organization"?: string | null
          "interpersonal or soft skills of the student"?: string | null
          "job title or designation at first organization"?: string | null
          "job title or designation at second organization"?: string | null
          "job title or designation at third organization"?: string | null
          "Languages the student can speak, understand, or is proficient i"?:
            | string
            | null
          name?: string | null
          "name of the college attended for graduation"?: string | null
          "name of the first organization worked at"?: string | null
          "Name of the organization where the student completed their summ"?:
            | string
            | null
          "name of the school attended for class 10"?: string | null
          "name of the school attended for class 12"?: string | null
          "name of the second organization worked at"?: string | null
          "name of the third organization worked at"?: string | null
          "name of the university attended for graduation"?: string | null
          "percentage marks obtained during graduation"?: number | null
          "percentage marks scored in class 10"?: number | null
          "percentage marks scored in class 12"?: number | null
          "projects or research work done during mba"?: string | null
          resume_parsed_data?: Json | null
          resume_url?: string | null
          "Role or profile undertaken by the student during their summer i"?:
            | string
            | null
          Roll_Number?: string | null
          "Second area of academic or professional specialization of the s"?:
            | string
            | null
          "specialization pursued during graduation"?: string | null
          "technical skills of the student"?: string | null
          "total work experience of the student in months"?: string | null
          "type of degree obtained during graduation"?: string | null
          user_id?: string | null
          "year when class 10 was completed"?: number | null
          "year when class 12 was completed"?: number | null
          "year when graduation was completed"?: number | null
        }
        Update: {
          "academic stream chosen in class 12"?: string | null
          "cgpa during mba program"?: number | null
          created_at?: string | null
          "current age of the student"?: number | null
          "date of birth in mm/dd/yyyy format"?: string | null
          "Desired job role or long-term career goal of the student"?:
            | string
            | null
          "did the student have any gaps in academic career"?: string | null
          "does the student have any prior work experience"?: string | null
          "domain or function at first organization"?: string | null
          "domain or function at second organization"?: string | null
          "domain or function at third organization"?: string | null
          "duration of academic gap in months"?: string | null
          "duration of work experience at first organization in months"?:
            | string
            | null
          "duration of work experience at second organization in months"?:
            | string
            | null
          "duration of work experience at third organization in months"?:
            | string
            | null
          "education board for class 10"?: string | null
          "education board for class 12"?: string | null
          email?: string | null
          "First area of academic or professional specialization of the st"?:
            | string
            | null
          "gender of the student"?: string | null
          id?: string
          "industry of the first organization"?: string | null
          "industry of the second organization"?: string | null
          "industry of the third organization"?: string | null
          "interpersonal or soft skills of the student"?: string | null
          "job title or designation at first organization"?: string | null
          "job title or designation at second organization"?: string | null
          "job title or designation at third organization"?: string | null
          "Languages the student can speak, understand, or is proficient i"?:
            | string
            | null
          name?: string | null
          "name of the college attended for graduation"?: string | null
          "name of the first organization worked at"?: string | null
          "Name of the organization where the student completed their summ"?:
            | string
            | null
          "name of the school attended for class 10"?: string | null
          "name of the school attended for class 12"?: string | null
          "name of the second organization worked at"?: string | null
          "name of the third organization worked at"?: string | null
          "name of the university attended for graduation"?: string | null
          "percentage marks obtained during graduation"?: number | null
          "percentage marks scored in class 10"?: number | null
          "percentage marks scored in class 12"?: number | null
          "projects or research work done during mba"?: string | null
          resume_parsed_data?: Json | null
          resume_url?: string | null
          "Role or profile undertaken by the student during their summer i"?:
            | string
            | null
          Roll_Number?: string | null
          "Second area of academic or professional specialization of the s"?:
            | string
            | null
          "specialization pursued during graduation"?: string | null
          "technical skills of the student"?: string | null
          "total work experience of the student in months"?: string | null
          "type of degree obtained during graduation"?: string | null
          user_id?: string | null
          "year when class 10 was completed"?: number | null
          "year when class 12 was completed"?: number | null
          "year when graduation was completed"?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
