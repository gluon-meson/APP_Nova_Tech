export type SALES_ORDER_ITEM = {
  id: number
  approval_date: string
  purchasing_unit: string
  contract_number: string
  delivery_commitment_date: string
  price_including_tax: string
  device_count: number
  unit_price: string
  model: string
  product_name: string
  product_group: number
  product_level: string
  salesperson: string
  third_department: string
  second_department: string
  currency: string
  remark: string
  freight: string
  exchange_rate: number
  material_code: string
  material_type: string
  order_type_description: string
  order_number: string
  line_item_number: number
  discount_amount: string
  sales_org: string
}


export type K_LINE_DATA = Array<
  [string, number, number, number, number, number]
>
