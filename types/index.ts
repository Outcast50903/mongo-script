export interface FileType {
  id: string
  name: string
}

export interface DriverMutate {
  phone: string
  first_name: string
  last_name: string
  email: string
  properties: Properties
  type: string
}

export interface Properties {
  custom: string
}

export interface GroupMutate {
  name: string
  assets?: string[]
  vehicles?: string[]
}

export interface LinkMutate {
  primary_id: number
  secondary_id: number
}
