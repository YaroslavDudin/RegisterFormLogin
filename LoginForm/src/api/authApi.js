export async function verifyCodeApi(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.code !== "123456")
        reject({ status: 400, message: "invalid code" });
      else resolve({ success: true });
    }, 1000);
  });
}

