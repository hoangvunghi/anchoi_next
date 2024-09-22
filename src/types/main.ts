export interface AnChoi {
  id: number;
  name: string;
  entertainment_type_id: number;
  entertainment_type_slug: string;
  ward_id: number;
  ward_slug: string;
  ward_name: string;
  full_address: string;
  phone_number: string;
  description: string;
  banner_image: string;
  price: any;
  name_of_owner: string;
  status: string;
  prefix: any;
  have_menu: number;
  slug: string;
  entertainment_type_name: string;
  additional_info: any;
  opening_hours: string;
  province_name: string;
  district_name: string;
  provin_slug: string;
  district_slug: string;
  average_rating: number;
  latitude?: string;
  longitude?: string;
  detailHeader?: string;
  header?: any
}

export interface EntertainmentType {
  id: number;
  name: string;
  slug: string;
  type: string;
  type_child: any;
  created_at: string;
  updated_at: string;
}

export interface Provice {
  id: number;
  name: string;
  slug: string;
  prefix: string;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: number;
  name: string;
  province_id: number;
  slug: string;
  prefix: string;
  created_at: string;
  updated_at: string;
}

export interface Ward {
  id: number;
  name: string;
  district_id: number;
  slug: string;
  prefix: any;
  created_at: string;
  updated_at: string;
}

export interface BlogType {
  id: number;
  title: string;
  slug: string;
  body: string;
  banner_image: string;
  category_id: number;
  category_slug: string;
  created_at: string;
  updated_at: string;
}

export interface IComment {
  name: string;
  email: string;
  body: string;
  number_of_star: string;
  entertainment_spot_id: number
}

export interface CommentData {
  id: number
  name: string
  email: string
  number_of_star: number
  body: string
  parent_id: any
  entertainment_spot_id: number
  created_at: string
  updated_at: string
  replies: {
    id: number
    name: string
    email: string
    number_of_star: any
    body: string
    parent_id: number
    entertainment_spot_id: number
    created_at: string
    updated_at: string
  }[]
}
