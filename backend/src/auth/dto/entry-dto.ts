export interface EntryDto {
  email: string;
}

export interface EntryAdminDto extends EntryDto {
  password: string;
}

export interface ITelegramAuthDto {
  id: number;
  first_name: string;
  last_name?: string
  username: string;
  photo_url: string;
  auth_date: number;
}

