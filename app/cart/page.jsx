"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CartItem from "@components/CartItem";
import Link from "next/link";

function Cart() {
  const router = useRouter();
  const { data: session } = useSession();

  const [orders, setOrders] = useState([]);
  const [quantity, setQuantity] = useState(null);
  const [total, setTotal] = useState(null);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const updateTotal = orders.reduce((acc, order) => {
      return (acc +=
        (order.price * order.quantity * (100 - discount?.discount ||  0)) / 100);
    }, 0);
    setTotal(updateTotal);
  }, [quantity, orders, discount?.discount]);

  useEffect(() => {
    const getOrders = () => {
      const storage = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(storage);
    };
    const getDiscount = () => {
      const storage = JSON.parse(localStorage.getItem("discount")) || null;
      setDiscount(storage);
    };
    getOrders();
    getDiscount();
  }, []);

  const handleIncrement = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, quantity: order.quantity + 1 };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleDecrement = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId && order.quantity > 0) {
        return { ...order, quantity: order.quantity - 1 };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleDelete = (orderId) => {
    const updatedOrders = orders.filter((order) => {
      if (order._id !== orderId) {
        return order;
      }
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleSubmitOrder = async () => {
    if (!session) return toast.error("Please signin for order");

    const orders = JSON.parse(localStorage.getItem("orders"));
    if (orders.length < 1) return alert("Please choose some products");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: orders,
          owner: session?.user.id,
          totalAmount: Number(total),
        }),
      });

      if (response.ok) {
        router.push("/shop");
        localStorage.removeItem("orders");
        localStorage.removeItem("discount");
        setDiscount(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeCoupon = (e) => {
    const discount = parseInt(JSON.parse(localStorage.getItem("discount")));
    const coupon = {
      value: discount,
      code: e,
    };
    setDiscount(coupon);
  };

  return (
    <section className="flex-center w-full flex-col">
      {orders.length > 0 && (
        <>
          <h2 className="subtitle_text blue_gradient font-satoshi">
            Shopping cart
          </h2>
          <div className="flex flex-col gap-12 py-10 lg:flex-row">
            <div className="flex-[2]">
              <h3 className="mb-3 font-inter text-lg font-bold">Cart Items</h3>
              <ul className="flex flex-col gap-2  md:gap-4">
                {orders.map((order) => (
                  <CartItem
                    key={order._id}
                    order={order}
                    handleDecrement={handleDecrement}
                    handleIncrement={handleIncrement}
                    handleDelete={handleDelete}
                  />
                ))}
              </ul>
            </div>
            <div className="flex-[1]">
              <h3 className="mb-3 text-lg font-bold">Summary</h3>
              <div className="mb-5 rounded-xl bg-black/[0.2] p-5">
                <div className="mb-3 flex justify-between">
                  <p className="text-md font-inter font-medium uppercase text-black md:text-lg">
                    Subtotal
                  </p>
                  <p className="text-md font-inter font-medium text-black md:text-lg">
                    {total} hrn
                  </p>
                </div>
                <label
                  htmlFor="discount"
                  className="block font-inter text-sm font-medium leading-6 text-gray-900"
                >
                  Coupon
                </label>

                <input
                  id="discount"
                  name="discount"
                  type="text"
                  placeholder="Please enter coupon here"
                  onChange={(e) => handleChangeCoupon(e.target.value)}
                  value={discount?.code}
                  className="form_input"
                />

                <p className="md:text-md mt-5 border-t py-5 font-inter text-sm">
                  The subtotal reflects the total price of your order, including
                  duties and taxes, before any applicable discounts. It does not
                  include delivery costs and international transaction fees.
                </p>
              </div>

              <button
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 font-inter text-lg font-medium text-white transition-transform hover:opacity-75 active:scale-95"
                onClick={handleSubmitOrder}
              >
                Buy
              </button>
            </div>
          </div>
        </>
      )}
      {orders.length < 1 && (
        <div className="flex flex-[2] flex-col items-center py-20  md:-mt-14">
          <p className="text-xl font-bold">Your cart is empty</p>
          <p className="mt-4 text-center">
            Looks like you have not added anything in your cart.
            <br />
            Go ahead and explore top categories.
          </p>
          <Link
            href="/shop"
            className="mb-3 mt-8 rounded-full bg-black px-8 py-4 text-lg font-medium text-white transition-transform hover:opacity-75 active:scale-95"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </section>
  );
}

export default Cart;
