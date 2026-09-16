import { Trash2 } from "lucide-react";

export interface PortfolioItem {
  id: number;
  ticker: string;
  quantity: number;
  buy_price: number;
  current_price: number;
  investment: number;
  current_value: number;
  profit_loss: number;
  percentage: number;
}

interface PortfolioTableProps {
  portfolio: PortfolioItem[];
  onAddStock: () => void;
  onDeleteStock: (id: number) => void;
}

function PortfolioTable({
  portfolio,
  onAddStock,
  onDeleteStock,
}: PortfolioTableProps) {
  return (
    <div className="table-card">
      <div className="card-heading">
        <div>
          <h2>My Portfolio</h2>
          <p>Your current stock holdings</p>
        </div>

        <button
          className="add-button"
          onClick={onAddStock}
        >
          + Add Stock
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>Profit / Loss</th>
              <th>Return</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {portfolio.map((stock) => (
              <tr key={stock.id}>
                <td>
                  <div className="stock-name">
                    <div className="stock-icon">
                      {stock.ticker.charAt(0)}
                    </div>

                    <strong>{stock.ticker}</strong>
                  </div>
                </td>

                <td>{stock.quantity}</td>

                <td>
                  ${stock.buy_price.toFixed(2)}
                </td>

                <td>
                  ${stock.current_price.toFixed(2)}
                </td>

                <td>
                  ${stock.current_value.toFixed(2)}
                </td>

                <td
                  className={
                    stock.profit_loss >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {stock.profit_loss >= 0 ? "+" : ""}
                  ${stock.profit_loss.toFixed(2)}
                </td>

                <td
                  className={
                    stock.percentage >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {stock.percentage >= 0 ? "+" : ""}
                  {stock.percentage.toFixed(2)}%
                </td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() =>
                      onDeleteStock(stock.id)
                    }
                    title="Delete stock"
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PortfolioTable;