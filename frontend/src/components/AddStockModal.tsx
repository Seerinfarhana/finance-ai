import {
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

import { X } from "lucide-react";

import {
  addStock,
} from "../services/api";


interface AddStockModalProps {
  onClose: () => void;
  onStockAdded: () => void;
}


function AddStockModal({
  onClose,
  onStockAdded,
}: AddStockModalProps) {

  const [ticker, setTicker] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [buyPrice, setBuyPrice] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (
      !ticker.trim() ||
      !quantity ||
      !buyPrice
    ) {
      setError(
        "Please fill all fields."
      );

      return;
    }


    if (Number(quantity) <= 0) {

      setError(
        "Quantity must be greater than 0."
      );

      return;
    }


    if (Number(buyPrice) <= 0) {

      setError(
        "Buy price must be greater than 0."
      );

      return;
    }


    try {

      setLoading(true);
      setError("");

      await addStock(
        ticker.trim().toUpperCase(),
        Number(quantity),
        Number(buyPrice)
      );

      await onStockAdded();

      onClose();

    } catch (error) {

      console.error(
        "Failed to add stock:",
        error
      );


      if (axios.isAxiosError(error)) {

        const message =
          error.response?.data?.detail;

        if (typeof message === "string") {

          setError(message);

        } else {

          setError(
            "Unable to add stock."
          );

        }

      } else {

        setError(
          "Unable to add stock."
        );

      }

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <div>
            <h2>Add Stock</h2>

            <p>
              Add a new stock to your
              portfolio.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Ticker Symbol
            </label>

            <input
              type="text"
              placeholder="Example: AAPL"
              value={ticker}
              maxLength={10}
              onChange={(event) =>
                setTicker(
                  event.target.value
                    .toUpperCase()
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Example: 10"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Buy Price ($)
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Example: 200"
              value={buyPrice}
              onChange={(event) =>
                setBuyPrice(
                  event.target.value
                )
              }
            />

          </div>


          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-button"
              disabled={loading}
            >
              {loading
                ? "Validating..."
                : "Add Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddStockModal;