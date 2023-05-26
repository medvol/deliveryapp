import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    item: [
      {
        type: Schema.Types.ObjectId,
        ref: "food",
        required: true,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Order = models.Order || model("Food", OrderSchema);

export default Order;