CREATE TYPE stock_data_type AS ENUM (
    'daily', 'weekly', 'monthly', 'yearly'
);
CREATE TABLE stock (
    ticker VARCHAR(10) NOT NULL,
    exchange_code VARCHAR(10) NOT NULL,
    ticker_name VARCHAR(255) NOT NULL,
    type stock_data_type NOT NULL,
    date DATE NOT NULL,
    open NUMERIC(10, 2) NOT NULL,
    high NUMERIC(10, 2) NOT NULL,
    low NUMERIC(10, 2) NOT NULL,
    close NUMERIC(10, 2) NOT NULL,
    volume MONEY NOT NULL
);

-- add comment
COMMENT ON COLUMN stock.ticker IS 'The stock ticker symbol';
COMMENT ON COLUMN stock.exchange_code IS 'The stock exchange code';
COMMENT ON COLUMN stock.ticker_name IS 'The full name of the company';
COMMENT ON COLUMN stock.type IS 'The type of stock data record (daily, weekly, monthly, or yearly)';
COMMENT ON COLUMN stock.date IS 'The date on which the stock data was recorded';
COMMENT ON COLUMN stock.open IS 'The opening price of the stock on the given date';
COMMENT ON COLUMN stock.high IS 'The highest price of the stock on the given date';
COMMENT ON COLUMN stock.low IS 'The lowest price of the stock on the given date';
COMMENT ON COLUMN stock.close IS 'The closing price of the stock on the given date';
COMMENT ON COLUMN stock.volume IS 'The trading volume of the stock on the given date';
