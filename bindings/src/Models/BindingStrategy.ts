

export interface BindingStrategy {
  global_variables: Partial<Record<string, Strategy>>
}

export type Strategy = "static" | "dynamic";