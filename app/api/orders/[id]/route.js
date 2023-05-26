import Order from "@models/order";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const orders = await Order.find({ owner: params.id })
      .populate({
        path: "items",
        model: "Food",
        select: "name",
      })
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all orders", { status: 500 });
  }
};