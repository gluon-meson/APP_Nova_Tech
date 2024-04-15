export const sqlTemplate = [
  {
    query: '一季度的总销售额是多少，把货币单位统一成人民币',
    sql: `
      SELECT
        SUM(
          order_T_1_.price_including_tax * CAST(order_T_1_.exchange_rate AS DECIMAL(15, 3))
        )
      FROM
        sales_order AS order_T_1_
      WHERE
          order_T_1_.approval_date BETWEEN '2024-01-01'  AND '2024-03-31'
      LIMIT 1000;
    `,
  },
  {
    query: '各二级销售部门的销售额是多少，把货币单位统一成人民币',
    sql: `
    SELECT
      order_T_1_.second_department AS second_department_1_,
      SUM(
        order_T_1_.price_including_tax * CAST(order_T_1_.exchange_rate AS DECIMAL(15, 3))
      ) AS sum_price_including_tax_x_e_c769
    FROM
      sales_order AS order_T_1_
    GROUP BY
      order_T_1_.second_department
    LIMIT 1000;
    `,
  },
  {
    query: '2月份各规格型号的销售额从高到低排序',
    sql: `
      SELECT
        "model",
        SUM("price_including_tax") AS "total_price_including_tax"
      FROM
        sales_order
      WHERE
        "approval_date" BETWEEN '2024-02-01' AND '2024-02-29'
      GROUP BY
        "model"
      ORDER BY
        "total_price_including_tax" DESC
      LIMIT 10;
    `,
  },
  {
    query:
      '单价前五的规格型号1、2、3月的销售额分别是多少，占总销售额的百分比是多少',
    sql: `
    with price_rank_pk as (
      select distinct unit_price, model from sales_order  order by unit_price desc
  )
  SELECT "model",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 1 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) AS "sales_in_january",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 1 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) /
             (SELECT SUM("price_including_tax" * "exchange_rate") FROM "sales_order" WHERE EXTRACT(MONTH FROM "approval_date") = 1) AS "percentage_in_january",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 2 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) AS "sales_in_february",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 2 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) /
             (SELECT SUM("price_including_tax" * "exchange_rate") FROM "sales_order" WHERE EXTRACT(MONTH FROM "approval_date") = 2) AS "percentage_in_february",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 3 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) AS "sales_in_march",
         SUM(CASE WHEN EXTRACT(MONTH FROM "approval_date") = 3 THEN "price_including_tax" * "exchange_rate" ELSE 0 END) /
             (SELECT SUM("price_including_tax" * "exchange_rate") FROM "sales_order" WHERE EXTRACT(MONTH FROM "approval_date") = 3) AS "percentage_in_march"
  FROM   "sales_order"
  WHERE  "model" IN (
             select model from price_rank_pk limit 5
         )
  GROUP BY "model"
  LIMIT  100;
    `,
  },
  {
    query:
      '采购额最高的TOP10大客户，采购数量前三的规格型号是什么，每个型号的销售额分别是多少',
    sql: `
      SELECT
        order_T_1_.purchasing_unit AS purchasing_unit_1_,
        order_T_1_.model AS model_2_,
        SUM(
          CAST(order_T_1_.unit_price AS DECIMAL(15, 3)) * order_T_1_.price_including_tax
        ) AS sum_unit_price_x_price_incl_5cf8
      FROM
        sales_order AS order_T_1_
      GROUP BY
        order_T_1_.purchasing_unit,
        order_T_1_.model
      ORDER BY
        sum_unit_price_x_price_incl_5cf8 DESC
      LIMIT 10;
    `,
  },
]
