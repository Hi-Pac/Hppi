
const functions = require("firebase-functions");
const fetch = require("node-fetch");

const TELEGRAM_TOKEN = "8132622542:AAF0nG25doWftQA1-RThLKKEb_HeAATVbOA";
const CHAT_ID = "-4618423800";

exports.notifyStatusChange = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status && (after.status === "مقبول" || after.status === "مرفوض")) {
      const message = `
🔔 *تم تحديث حالة الطلب!*
👤 *العميل:* ${after.clientName}
📐 *المقاس:* ${after.size || 'غير محدد'}
🔢 *العدد:* ${after.quantity}
📅 *تاريخ التسليم:* ${after.deliveryDate}
✅ *الحالة الجديدة:* ${after.status}
🧑‍💼 *تم التحديث بواسطة:* ${after.updatedBy || after.createdBy || after.createdEmail}
`;

      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown"
        })
      });
    }
  });
