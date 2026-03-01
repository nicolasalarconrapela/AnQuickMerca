export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'store_selection'
  | 'home'
  | 'product_search'
  | 'list_detail'
  | 'layout_organization'
  | 'active_navigation';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

export interface ListItem extends Product {
  quantity: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  storeName: string;
  date: string;
  items: ListItem[];
  status: 'pending' | 'completed';
}
